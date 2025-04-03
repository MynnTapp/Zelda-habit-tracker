
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Route imports
const authRoutes = require("./routes/authRoutes");
const habitRoutes = require("./routes/habitRoutes");
const challengesRoutes = require("./routes/challengesRoutes");
const villainRoutes = require("./routes/VillainRoute");

const app = express();

// Swagger configuration
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Zelda Habit Tracker API",
      version: "1.0.0",
      description: "API documentation for the Zelda-inspired habit tracker",
    },
    servers: [
      {
        url: "https://zelda-habit-tracker.onrender.com",
        description: "Production server",
      },
      {
        url: "http://localhost:5300",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token in format: Bearer <token>",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to your route files
};

const specs = swaggerJsdoc(options);

// Middleware
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["https://zelda-habit-tracker.onrender.com", "http://localhost:5300"],
  })
);
app.use(cookieParser());

// Add consistent response headers
app.use((req, res, next) => {
  res.header("Content-Type", "application/json");
  next();
});

// Swagger UI setup
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1, // Hide schemas
      docExpansion: "none", // Collapse all
      persistAuthorization: true, // Save auth
      displayRequestDuration: true,
      tryItOutEnabled: true, // Enable "Try it out" by default
    },
    customSiteTitle: "Zelda Habit Tracker API Docs",
    explorer: true,
  })
);

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/habits", habitRoutes); // Habit tracking routes
app.use("/api/challenges", challengesRoutes); // Coding challenges routes
app.use("/api/villains", villainRoutes); // Villain management routes

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Test endpoint for Swagger verification
/**
 * @swagger
 * /api/ping:
 *   get:
 *     tags: [Testing]
 *     summary: Test API connection
 *     description: Returns a simple response to verify the API is working
 *     responses:
 *       200:
 *         description: Successful ping
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "pong"
 */
app.get("/api/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Zelda Habit Tracker API",
    documentation: "/api-docs",
    endpoints: {
      auth: "/api/auth",
      habits: "/api/habits",
      challenges: "/api/challenges",
      villains: "/api/villains",
    },
  });
});

// Database connection
connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 5300;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});