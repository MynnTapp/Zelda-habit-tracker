require("dotenv").config();
const mongoose = require("mongoose");
//import seedAdmins from "../adminAccounts"

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    //seedAdmins();
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
