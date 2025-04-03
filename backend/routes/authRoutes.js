const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {authMiddleware, adminMiddleware} = require("../middleware/authMiddleWare");
const {blacklistedTokens, userblacklistedTokens} = require("../blacklistedtokens")


const router = express.Router();

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *             example:
 *               username: "testuser"
 *               email: "test@employer.com"
 *               password: "test1234"
 *               first_name: "Test"
 *               last_name: "User"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */

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
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Login User
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login and get JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: "test@employer.com"
 *               password: "test1234"
 *     responses:
 *       200:
 *         description: Returns user data + HTTP-only cookie
 *         content:
 *           application/json:
 *             example:
 *               message: "Login successful"
 *               user: { id: "123", email: "test@employer.com", username: "testuser" }
 *       400:
 *         description: Invalid credentials
 */

//////////////////////login///
/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Get current user profile (protected)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user data
 *         content:
 *           application/json:
 *             example:
 *               userId: "123"
 *               username: "testuser"
 *               email: "test@employer.com"
 *       401:
 *         description: Unauthorized (missing/invalid token)
 */


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
    rupees: req.user.rupees,
    xp: req.user.xp,
    mapProgress: req.user.mapProgress
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


//admin-login

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login (returns JWT)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: "admin@test.com"
 *               password: "admin123"
 *     responses:
 *       200:
 *         description: Returns admin token
 *       404:
 *         description: Admin not found
 */

router.post("/admin/login", async (req, res) => {


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

//update user

/**
 * @swagger
 * /api/{userId}/edit:
 *   put:
 *     summary: Update user profile (protected)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *             example:
 *               first_name: "UpdatedName"
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */

router.put("/:userId/edit", authMiddleware, async (req, res) =>{
  const {userId} = req.params;
  const updatedData = req.body

  try{
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true
    });
    if(!updatedUser){
      return res.status(404).json({message: "no user found!"})
    }
    res.status(200).json(updatedUser)
  } catch(err){
    res.status(500).json({message: "could not update user", error: err.message})
  }
});

router.delete("/users/:userId", adminMiddleware, async (req, res) =>{
  const {userId} = req.params;
  try{
    const user = await User.deleteOne({_id: userId});
    if(!user){
      res.status(404).json({message: "user not found"});
    }
    res.status(200).json({message: "user successfully deleted"});
  } catch(err){
    res.status(500).json({message: "could not delete user", error: err.message});
  }
});

//get all users

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (admin-only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Forbidden (non-admin token)
 */

router.get("/users", adminMiddleware, async (req, res) =>{
  try{
    const users = await User.find();
    if(!users){
      res.status(404).json({message: "users not found"});
    }
    res.status(200).json(users)
  } catch (err){
    res.status(500).json({message: "could not fetch users", error: err.message});
  }
})

//Edge-cases (wrong login)

/**
 * @swagger
 * /api/login:
 *   post:
 *     ...
 *     responses:
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid credentials"
 */

//protected-route without token

/**
 * @swagger
 * /api/me:
 *   get:
 *     ...
 *     responses:
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: "No token provided"
 */



module.exports = router;
