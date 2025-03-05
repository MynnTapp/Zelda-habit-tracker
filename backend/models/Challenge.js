const mongoose = require("mongoose");

const ChallengeSchema = new mongoose({
    title: String,
    description: String,
    difficulty: {type: string, enum: ["Easy", "Medium", "Hard"]},
    codesnippet: String,
    solution: String,
    rewards: {rupees: Number, xp: Number},
    createdAt: {type: Date, default: Date.now}
})


module.exports = mongoose.model("Challenge", ChallengeSchema)