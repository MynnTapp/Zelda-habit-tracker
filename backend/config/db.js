require("dotenv").config();
const mongoose = require("mongoose");
//import seedAdmins from "../adminAccounts"

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    //seedAdmins();
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
