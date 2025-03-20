const mongoose = require("mongoose");
require("dotenv").config();
const Villain = require("../models/Villain");

const villains = [
    {
    name: "Glitch Goblin",
  location: "Kakiro's village",
  hp: 150,
  attackPower: 2,
  difficulty: "Easy"
    },

    {
      name: "Syntax slug",
      location: "Kakiro's village",
      hp: 160,
      attackPower: 2,
      difficulty: "Easy",
    },
    {
      name: "Typo Gremlin",
      location: "Kakiro's village",
      hp: 140,
      attackPower: 1,
      difficulty: "Easy",
    },
    {
      name: "Debug Drone",
      location: "Kakiro's village",
      hp: 135,
      attackPower: 1,
      difficulty: "Easy"
    },
    {
      name: "Lint Lurker",
      location: "Kakiro's village",
      hp: 145,
      attackPower: 2,
      difficulty: "Easy"
    },
    {
      name: "HexaCipher",
      location: "Forest of Shadows",
      hp: 200,
      attackPower: 5,
      difficulty: "Medium"
    },
    {
      name: "GlitchLord",
      location: "Forest of Shadows",
      hp: 250,
      attackPower: 6,
      difficulty: "Medium"
    },

    {
      name: "CodeRuptor",
      location: "Forest of Shadows",
      hp: 230,
      attackPower: 4,
      difficulty: "Medium"
    },
    {
      name: "BitPhantom",
      location: "Forest of Shadows",
      hp: 235,
      attackPower: 4,
      difficulty: "Medium"
    },

    {
      name: "SyntaxSlinger",
      location: "Forest of Shadows",
      hp: 222,
      attackPower: 5,
      difficulty: "Medium"
    },
    {
      name: "The Debugger",
      location: "Forest of Shadows",
      hp: 215,
      attackPower: 5,
      difficulty: "Medium"
    },
    {
      name: "Malwareon",
      location: "Mountain of Eternity",
      hp: 300,
      attackPower: 7,
      difficulty: "Hard"
    },

    {
      name: "DarkSector",
      location: "Mountain of Eternity",
      hp: 315,
      attackPower: 6,
      difficulty: "Hard"
    },
    {
      name: "AbyssalNode",
      location: "Mountain of Eternity",
      hp: 320,
      attackPower: 7,
      difficulty: "Hard"
    },
    {
      name: "PrimeChaos",
      location: "Mountain of Eternity",
      hp: 300,
      attackPower: 8,
      difficulty: "Hard"
    },
    {
      name: "Overlord.DOS",
      location: "Mountain of Eternity",
      hp: 350,
      attackPower: 8,
      difficulty: "Hard"
    }
]


async function seedVillians(){
  try{
    await mongoose.connect(process.env.MONGO_URI);
    await Villain.deleteMany({});
    await Villain.insertMany(villains);
    console.log("Villains successfully added!")
  } catch(err){
    console.error("Villains could not be added", err);
  } finally{
    mongoose.connection.close();
  }
}

seedVillians();