const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    first_name: {type: String, required: true, unique: false},
    last_name: {type: String, required: true, unique: false},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {type: String, enum:["user", "admin"], default: "user"},
    rupees: {type: Number, default: 0},
    hearts: {type: Number, default: 3},
    inventory: [String],
    streak: {type: Number, default: 0},
    mapProgress: {type: String, default: "Kakiro's village"},
    createdAt: {type: Date, default: Date.now}
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", UserSchema);
