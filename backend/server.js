
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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" })); // Update origin for frontend
app.use(cookieParser());

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
