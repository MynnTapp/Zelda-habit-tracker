const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {blacklistedTokens} = require("../blacklistedtokens")

console.log(blacklistedTokens)


// Middleware to verify JWT and user role
const authMiddleware = async (req, res, next) => {
   try {
     const token = req.cookies.token;

     // If no token, return { user: null }
     if (!token) {
       return res.status(200).json({ user: null });
     }

     const decoded = jwt.verify(token, process.env.JWT_SECRET);

     // Find user in DB
     const user = await User.findOne({ _id: decoded.id });

     if (!user) {
       return res.status(200).json({ user: null });
     }

     req.user = user;
     next();
   } catch (e) {
     return res.status(200).json({ user: null });
   }
};

// Middleware to check if user is admin
const adminMiddleware = async (req, res, next) =>{
let token = req.header("Authorization")?.replace("Bearer ", "");

if (!token) {
  token = req.cookies.token; // Fallback to cookie token
}

if (!token) {
  return res.status(401).json({ message: "Access denied. No token provided." });
}

if (blacklistedTokens.has(token)) {
  return res.status(401).json({ message: "Session expired. Please log in again." });
}

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Not an admin." });
  }

  req.user = decoded;
  next();
} catch (error) {
  res.status(401).json({ message: "Invalid token" });
}
}

module.exports = { authMiddleware, adminMiddleware };
