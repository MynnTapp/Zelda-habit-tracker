const User = require("./models/User");
const Villain = require("./models/Villain");


async function loseXp(userId){
    const user = await User.findById(userId);
    if(!user){
        console.log("user could not be found");
        return;
    }

    user.xp -= 5
    await user.save();
}

module.exports = loseXp