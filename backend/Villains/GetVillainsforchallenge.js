const Challenge = require("../models/Challenge");
const Villain = require("../models/Villain");


async function getVilliansForChallenge(challengeId){
    const challenge = await Challenge.findById(challengeId);
    if(!challenge){
        throw new Error("Challenge not found")
    }
    const villain = await Villain.aggregate([
      {
        $match: { difficulty: challenge.difficulty },
      },
      {
        $sample: {size: 1}
      },
    ]);

    return villain[0] || null;
}

module.exports = getVilliansForChallenge;