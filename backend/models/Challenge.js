const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  codesnippet: { type: String, default: "" },
  solutions: { type: [String], required: true }, // Approved solutions
  pendingSolutions: { type: [String], default: [] }, // Solutions waiting for admin approval
  testCases: {
    type: [
      {
        input: [mongoose.Schema.Types.Mixed],
        expected: mongoose.Schema.Types.Mixed,
      },
    ],
    default: [],
    _id: false, // Disable automatic _id generation for testCases
  },
  rewards: {
    rupees: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Challenge", ChallengeSchema);
