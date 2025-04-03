const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const authRoutes = require("./routes/authRoutes");
const habitRoutes = require("./routes/habitRoutes");
const challengesRoutes = require("./routes/challengesRoutes");
const villainRoutes = require("./routes/VillainRoute");

const app = express();

// ==============================================
// 1. Enhanced Swagger Configuration
// ==============================================
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Zelda Habit Tracker API",
      version: "1.0.0",
      description: "Interactive API Documentation",
    },
    servers: [
      {
        url: "https://zelda-habit-tracker.onrender.com",
        description: "Production server",
      },
      {
        url: `http://localhost:${process.env.PORT || 5300}`,
        description: "Local development",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

// ==============================================
// 2. Critical Middleware Fixes
// ==============================================
app.use(express.json());
app.use(cookieParser());

// Enhanced CORS configuration
app.use(
  cors({
    credentials: true,
    origin: [
      "https://zelda-habit-tracker.onrender.com",
      "http://localhost:5173", // For future frontend
    ],
  })
);

// Response headers middleware (fixed)
app.use((req, res, next) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// ==============================================
// 3. Swagger UI Setup (Fixed)
// ==============================================
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    swaggerOptions: {
      defaultModelsExpandDepth: 0,
      docExpansion: "list",
      persistAuthorization: true,
      displayRequestDuration: true,
      tryItOutEnabled: true,
    },
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Zelda API Docs",
  })
);

// ==============================================
// 4. Test Endpoints (Verify First)
// ==============================================
/**
 * @swagger
 * /api/healthcheck:
 *   get:
 *     tags: [System]
 *     summary: Service health check
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             example: { status: "OK", timestamp: "2023-07-20T12:00:00Z" }
 */
app.get("/api/healthcheck", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// ==============================================
// 5. Route Configuration (Fixed)
// ==============================================
// Fixed route prefixes (don't put all under /api/auth)
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/challenges", challengesRoutes);
app.use("/api/villains", villainRoutes);

// ==============================================
// 6. Error Handling Middleware (Crucial)
// ==============================================
app.use((err, req, res, next) => {
  console.error("⚠️ Error:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ==============================================
// 7. Database & Server Startup
// ==============================================
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5300;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("💥 Failed to connect to DB:", err);
    process.exit(1);
  });
