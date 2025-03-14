const User = require("./models/User");

async function updateUserMapProgress(userId) {
  try {
    // Fetch the user from the database
    const user = await User.findById(userId);

    if (!user) {
      console.log("User not found!");
      return;
    }

    // Define the map progression and the rupees required to unlock the next map
    const mapProgression = [
      { map: "Kakiro's village", requiredRupees: 0 },
      { map: "Forest of Shadows", requiredRupees: 100 },
      { map: "Mountain of Eternity", requiredRupees: 250 },
      { map: "Desert of Secrets", requiredRupees: 500 },
      { map: "Sky City", requiredRupees: 1000 },
    ];

    // Check the user's current rupees and determine the map progress
    let newMap = "Kakiro's village"; // Default map
    for (let i = mapProgression.length - 1; i >= 0; i--) {
      if (user.rupees >= mapProgression[i].requiredRupees) {
        newMap = mapProgression[i].map;
        break;
      }
    }

    // Update the user's mapProgress if necessary
    if (user.mapProgress !== newMap) {
      user.mapProgress = newMap;
      await user.save();
      console.log(`User's map has been updated to: ${newMap}`);
    } else {
      console.log("User is already on the correct map.");
    }
  } catch (error) {
    console.error("Error updating user map progress:", error);
  }
}

module.exports = {updateUserMapProgress};
