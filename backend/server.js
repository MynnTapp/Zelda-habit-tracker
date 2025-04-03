
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const authRoutes = require("./routes/authRoutes");
const habitRoutes = require("./routes/habitRoutes")
const challengesRoutes = require("./routes/challengesRoutes")
const villainRoutes = require("./routes/VillainRoute");

const app = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Zelda-habit-tracker",
      version: "1.0.0",
      description: "API documentation for employers to test routes",
    },
    servers: [
      {
        url: "https://zelda-habit-tracker.onrender.com", // Update with your Render URL
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to your route files
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      docExpansion: "none",
      persistAuthorization: true,
      displayRequestDuration: true,
    },
    customSiteTitle: "Zelda Habit Tracker API Docs",
    explorer: true,
  })
);



// Middleware
app.use(express.json());
app.use(cors({ credentials: true, origin:"https://zelda-habit-tracker.onrender.com" })); // Update origin for frontend
app.use(cookieParser());
app.use((req, res, next) => {
  res.header("Content-Type", "application/json");
  next();
});

/**
 * @swagger
 * /api/ping:
 *   get:
 *     summary: Test API connection
 *     responses:
 *       200:
 *         description: Successful ping
 *         content:
 *           application/json:
 *             example:
 *               message: "pong"
 */
app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: "pong" });
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", habitRoutes);
app.use("/api/auth", challengesRoutes);
app.use("/api/auth", villainRoutes);

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  //seedAdmins();
  res.send("API is running...");
});


const PORT = process.env.PORT || 5300;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
