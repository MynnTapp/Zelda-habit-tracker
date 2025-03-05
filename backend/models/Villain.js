const mongoose = require("mongoose");


const VillainSchema = new mongoose({
  name: String,
  location: String,
  hp: Number,
  attackPower: Number,
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
});

module.exports = mongoose.model("Villain", VillainSchema);