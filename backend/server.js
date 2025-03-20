
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
//const seedAdmins = require("./adminAccounts")

const authRoutes = require("./routes/authRoutes");
const habitRoutes = require("./routes/habitRoutes")
const challengesRoutes = require("./routes/challengesRoutes")
const villainRoutes = require("./routes/VillainRoute");

const app = express();

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
