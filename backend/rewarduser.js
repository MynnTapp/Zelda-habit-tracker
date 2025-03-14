
const User = require("./models/User");
const { updateUserMapProgress } = require("./updatemapprogress");

// Assuming you have a function that rewards users with rupees
 async function rewardUserWithRupees(userId) {
  const user = await User.findById(userId);
  if (!user) {
    console.log("User not found!");
    return;
  }

  user.rupees += 10;
  await user.save();

  // Now update the user's map based on the new rupees total
  await updateUserMapProgress(userId);
}

module.exports = {rewardUserWithRupees}