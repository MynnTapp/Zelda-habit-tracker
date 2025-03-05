const mongoose = require("mongoose");

const HabitSchema = new mongoose({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: {type: String, required: true},
  description: String,
  frquency: {type: String, enum: ["Daily", "Weekly", "Monthly"]},
  completedDates: [Date],
  streak: {type: Number, default: 0},
  rewards: {rupees: Number, xp: Number},
  createdAt: {type: Date, default: Date.Now}
});



module.exports = mongoose.model("Habit", HabitSchema);