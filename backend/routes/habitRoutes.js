const express = require("express");
const Habit = require("../models/Habit");
const {authMiddleware} = require("../middleware/authMiddleWare")
const router = express.Router();
const { rewardUserWithRupees } = require("../rewarduser");

/**
 * @swagger
 * tags:
 *   - name: Habits
 *     description: User habit tracking operations
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Habit:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         userId:
 *           type: string
 *           example: "507f1f77bcf86cd799439012"
 *         name:
 *           type: string
 *           example: "Daily Exercise"
 *         description:
 *           type: string
 *           example: "30 minutes of cardio"
 *         frequency:
 *           type: string
 *           enum: [Daily, Weekly, Monthly]
 *           example: "Daily"
 *         rewards:
 *           type: object
 *           properties:
 *             rupees:
 *               type: number
 *               example: 10
 *             xp:
 *               type: number
 *               example: 20
 *         completedDates:
 *           type: array
 *           items:
 *             type: string
 *             format: date
 *           example: ["2023-05-01T00:00:00.000Z"]
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

//create habit

/**
 * @swagger
 * /api/habits:
 *   post:
 *     tags: [Habits]
 *     summary: Create a new habit
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Daily Meditation"
 *               description:
 *                 type: string
 *                 example: "15 minutes of mindfulness"
 *               frequency:
 *                 type: string
 *                 example: "Daily"
 *     responses:
 *       201:
 *         description: Habit created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "habit Created!"
 *                 createdhabit:
 *                   $ref: '#/components/schemas/Habit'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: "Validation error message"
 *       401:
 *         description: Unauthorized (missing/invalid token)
 */

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

/**
 * @swagger
 * /api/habits/{habitId}/complete:
 *   put:
 *     tags: [Habits]
 *     summary: Mark habit as completed for a date
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2023-05-01"
 *     responses:
 *       200:
 *         description: Habit marked as completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "habit completed!"
 *                 habit:
 *                   $ref: '#/components/schemas/Habit'
 *       400:
 *         description: Already completed or bad request
 *         content:
 *           application/json:
 *             examples:
 *               alreadyCompleted:
 *                 value:
 *                   message: "You already completed your habit for the day!"
 *               badRequest:
 *                 value:
 *                   error: "Validation error message"
 *       404:
 *         description: Habit not found
 *       500:
 *         description: Server error
 */


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
/**
 * @swagger
 * /api/users/{userId}/habits:
 *   get:
 *     tags: [Habits]
 *     summary: Get all habits for a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439012"
 *     responses:
 *       200:
 *         description: List of user's habits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Habit'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.get("/users/:userId/habits", authMiddleware, async (req, res) =>{
    const {userId} = req.params
    try{
        const habits = await Habit.find({id: userId.id})
        res.status(200).json(habits);
    } catch(error){
        
        res.status(500).json({error: error.message})
    }
})

/**
 * @swagger
 * /api/habits/{habitId}:
 *   delete:
 *     tags: [Habits]
 *     summary: Delete a habit
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Habit deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "habit successfully deleted"
 *                 habit:
 *                   $ref: '#/components/schemas/Habit'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Habit not found
 *       500:
 *         description: Server error
 */

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



