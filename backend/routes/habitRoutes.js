const express = require("express");
const Habit = require("../models/Habit");
const {authMiddleware} = require("../middleware/authMiddleWare")
const router = express.Router();
const { rewardUserWithRupees } = require("../rewarduser");


//create habit

router.post("/habits", authMiddleware, async (req, res) =>{
    try{
        const userId = req.user.id;
        const habit = new Habit({
          userId: userId,
          name: req.body.name,
          description: req.body.description,
          frequency: req.body.frequency,
          rewards: { rupees: 10, xp: 20 }, // Default rewards
        });
        await habit.save();
        res.status(201).json({message: "habit Created!", createdhabit: habit})
    } catch(error){
        res.status(400).json({error: error.message})
    }
} )

//logging habits dates
//after logging habit, user can ear rupees and add to their level

router.put("/habits/:habitId/complete", authMiddleware, async (req, res) =>{
    const userId = req.user.id;
    const {habitId} = req.params;
    const {date} = req.body;

    try{
        const habit = await Habit.findOne({ _id: habitId, userId });

        if(!habit) res.json({message: "habit could not be found"});
const completedDate = date ? new Date(date) : new Date();
completedDate.setHours(0, 0, 0, 0);

const alreadyCompleted = habit.completedDates.some((entry) =>{
    new Date(entry.date).getTime() === completedDate.getTime();
})

if(alreadyCompleted){
    res.json({message: "You already completed your habit for the day!"})
}

habit.completedDates.push(completedDate);
rewardUserWithRupees(userId);
await habit.save();
res.status(200).json({message: "habit completed!", habit})
    } catch (error){
         //const habit = await Habit.findOne({ _id: habitId, userId });

        //console.log(habit.completedDates)
        res.status(500).json({error: error.message})
    }
})

//Get a users habits

router.get("/users/:userId/habits", authMiddleware, async (req, res) =>{
    const {userId} = req.params
    try{
        const habits = await Habit.find({id: userId.id})
        res.status(200).json(habits);
    } catch(error){
        
        res.status(500).json({error: error.message})
    }
})


router.delete("/habits/:habitId", authMiddleware, async (req, res) =>{
    const {habitId} = req.params;
    try{
        const habit = await Habit.deleteOne({_id: habitId})
        res.status(200).json({message:"habit successfully deleted"}, habit)
    } catch(error) {
        res.status(500).json({message: error.message})
    }
})

module.exports = router



