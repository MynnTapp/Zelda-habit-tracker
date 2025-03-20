const mongoose = require("mongoose");


const VillainSchema = new mongoose.Schema({
  name: String,
  location: String,
  hp: Number,
  attackPower: Number,
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
});

module.exports = mongoose.model("Villain", VillainSchema);