const jwt = require("jsonwebtoken");
const User = require("../models/User");

// const authMiddleware = (req, res, next) => {
//   const token = req.cookies?.token;
//   console.log("Token:", token); // Log the token to see if it's being passed

//   if (!token) return res.status(401).json({ message: "Unauthorized" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded token:", decoded); // Log decoded token to see its contents
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error("Error verifying token:", error);
//     return res.status(403).json({ message: "Invalid token" });
//   }
// };



// ////////////////////////////



// const adminMiddleware = async (req, res, next) => {
//   console.log("req.user:", req.user); // Debugging step

//   if (!req.user || !req.user.id) {
//     return res.status(401).json({ message: "Unauthorized access" });
//   }

//   // Ensure req.user.id is an actual ObjectId
//   const user = await User.findById(req.user.id);
//   console.log("User found:", user); // Debugging step

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   if (user.role === "admin") {
//     return next();
//   } else {
//     return res.status(403).json({ message: "Access denied. Admins only." });
//   }
// };


// module.exports = {authMiddleware, adminMiddleware};



// Middleware to verify JWT and user role
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token; 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });


    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (e) {
    res.status(401).send("Please authenticate");
  }
};

// Middleware to check if user is admin
const adminMiddleware = async (req, res, next) =>{
const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    req.admin = decoded; // Store decoded admin data in request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { authMiddleware, adminMiddleware };
