require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Import JWT
const User = require("./models/User"); // Import your User model

async function seedAdmins() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const admins = [
      { first_name: "Desmynn", last_name: "Tappin", username: "MusaBear45", email: "Desmynn@zelda.com", password: "MusaBearAdmin56" },
      { first_name: "Josh", last_name: "White", username: "Sneck67", email: "Snecko@zelda.com", password: "NoUAdmin78" },
    ];

    for (const admin of admins) {
      const existingAdmin = await User.findOne({ email: admin.email });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(admin.password, 10);
        const user = await User.create({
          ...admin,
          password: hashedPassword,
          role: "admin",
        });

        // Generate a JWT token for the created admin user
        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        console.log(`Admin ${admin.username} created with token: ${token}`);
      } else {
        console.log(`Admin ${admin.username} already exists.`);
      }
    }
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedAdmins();
