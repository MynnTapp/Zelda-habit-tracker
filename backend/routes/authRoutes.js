const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {authMiddleware, adminMiddleware} = require("../middleware/authMiddleWare");
const {blacklistedTokens, userblacklistedTokens} = require("../blacklistedtokens")


const router = express.Router();



// Register User
router.post("/register", async (req, res) => {
  try {
    const { username, email, first_name, last_name, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({ username, email, password: hashedPassword, first_name, last_name});
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === "production", // Use only in HTTPS
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ message: "Login successful", user: { id: user._id, email: user.email, username: user.username } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/me", authMiddleware, async (req, res) => {
  if (!req.user) {
    return res.status(200).json({ user: null });
  }

  res.json({
    userId: req.user._id,
    username: req.user.username,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
  });
});


router.post("/logout", authMiddleware, (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  userblacklistedTokens.add(token); // Add token to blacklist
  console.log("Blacklisted Tokens:", userblacklistedTokens); // Debugging

  res.clearCookie("token"); // Ensure token is removed from cookies
  res.json({ message: "user logged out successfully" });
});


router.post("/admin/login", async (req, res) => {
  // const { username, password } = req.body;
  // const adminUser = await User.findOne({ username });
  // try {
  //   if (!adminUser) return res.json({ message: "you are not an admin" });
  //   const isMatch = await bcrypt.compare(password, adminUser.password);
  //   if (!isMatch) return res.status(400).json({ message: "Invalid admin credentials" });

  //   const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  //   // Set token in HTTP-only cookie
  //   res.cookie("token", token, {
  //     httpOnly: true, // Prevents XSS attacks
  //     secure: process.env.NODE_ENV === "production", // Use only in HTTPS
  //     sameSite: "strict", // CSRF protection
  //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  //   });
  //   res.json({ message: `Welcome to your admin account ${adminUser}` });
  // } catch (error) {
  //   return res.json({ message: "server error" });
  // }

try {
  const { email, password } = req.body;

  // Check if the admin exists
  const admin = await User.findOne({email, role: "admin" });
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  // Validate password
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Generate JWT Token
  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" } // Token expires in 2 hours
  );

  // Send response with token
  res.json({
    message: "Admin logged in successfully",
    token,
    admin: { id: admin._id, username: admin.username, email: admin.email },
  });
} catch (error) {
  console.error("Login error:", error);
  res.status(500).json({ message: "Server error" });
}


});


router.get("/users", adminMiddleware, async (req, res) =>{
  try{
const users = await User.find();
res.status(200).json(users)
  } catch (error) {
    res.status(500).json({message: "could not retrieve users"})
  }
})

router.post("/admin/logout", adminMiddleware, (req, res) =>{
  

  // if (token) {
  //   blacklistedTokens.add(token); // Add token to the blacklist
  // }

  // res.json({ message: "Admin Logged out successfully" });

const token = req.header("Authorization")?.replace("Bearer ", "");

if (!token) {
  return res.status(400).json({ message: "No token provided" });
}

blacklistedTokens.add(token); // Add token to blacklist
console.log("Blacklisted Tokens:", blacklistedTokens); // Debugging

res.clearCookie("token"); // Ensure token is removed from cookies
res.json({ message: "Admin logged out successfully" });

})

router.get("/admin/me", adminMiddleware, async (req, res) =>{
  try {
    const admin = await User.findById(req.user.id); // Use the logged-in admin ID

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({
      id: admin._id,
      username: admin.username,
      first_name: admin.first_name,
      last_name: admin.last_name,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
})

module.exports = router;
