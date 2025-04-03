const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleWare");
const Challenge = require("../models/Challenge");
const router = express.Router();
const testCodeSnippet = require("../tests/code-tester")
const getVilliansForChallenge = require("../Villains/GetVillainsforchallenge");
const loseXp = require("../combat");
const Villain = require("../models/Villain")
const rewardUserWithRupees = require("../rewarduser");

/**
 * @swagger
 * tags:
 *   - name: Challenges
 *     description: Coding challenge operations
 *   - name: Admin Challenges
 *     description: Admin-only challenge management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Challenge:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         title:
 *           type: string
 *           example: "Array Sum"
 *         description:
 *           type: string
 *           example: "Write a function that sums all numbers in an array"
 *         difficulty:
 *           type: string
 *           enum: [Easy, Medium, Hard]
 *           example: "Easy"
 *         testCases:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               input:
 *                 type: string
 *                 example: "[1,2,3]"
 *               output:
 *                 type: string
 *                 example: "6"
 *         solutions:
 *           type: array
 *           items:
 *             type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// ================== USER ROUTES ================== //

/**
 * @swagger
 * /api/challenge/easy:
 *   get:
 *     tags: [Challenges]
 *     summary: Get all easy challenges
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of easy challenges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Challenge'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */


router.get("/challenge/easy", authMiddleware, async (req, res) =>{
    const challenge = await Challenge.find({ difficulty: "Easy" });
    try{
       res.status(200).json(challenge)
    } catch(err){
        res.status(500).json({message: "could not retrieve challenges", error: err.message})
    }
})


/**
 * @swagger
 * /api/challenge/medium:
 *   get:
 *     tags: [Challenges]
 *     summary: Get all medium challenges
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of medium challenges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Challenge'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.get("/challenge/medium", authMiddleware, async (req, res) =>{
    const challenge = await Challenge.find({difficulty: "Medium"});
    try{
        res.status(200).json(challenge);
    } catch(err){
        res.status(500).json({message: "could not retrieve challenges", error: err.message})
    }
})

/**
 * @swagger
 * /api/challenge/hard:
 *   get:
 *     tags: [Challenges]
 *     summary: Get all hard challenges
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of hard challenges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Challenge'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.get("/challenge/hard", authMiddleware, async (req, res) =>{
    const challenge = await Challenge.find({difficulty: "Hard"});
    try{
        res.status(200).json(challenge);
    } catch (err){
        res.status(500).json({message: "Could not retrieve challenges", error: err.message});
    }
})


//get certain level challenges, based on id

/**
 * @swagger
 * /api/challenge/easy/{challengeId}:
 *   get:
 *     tags: [Challenges]
 *     summary: Get specific easy challenge with villain
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Challenge details with assigned villain
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 question:
 *                   type: string
 *                 Villain:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     hp:
 *                       type: number
 *       400:
 *         description: Challenge not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.get("/challenge/easy/:challengeId", authMiddleware, async (req, res) =>{
    const {challengeId} = req.params;
    const challenge = await Challenge.findOne({difficulty: "Easy", _id: challengeId});

    try{
        const getVillain = await getVilliansForChallenge(challengeId);
        if (!challenge) {
          return res.status(400).json({ message: "could not find challenge" });
        }
        console.log(getVillain);
        res.status(200).json({
          title: challenge.title,
          question: challenge.description,
          Villain: getVillain
        });
        
    } catch(err){
        res.status(500).json({message: "could not retrieve challenge", error: err.message});
    }
    
})

/**
 * @swagger
 * /api/challenge/medium/{challengeId}:
 *   get:
 *     tags: [Challenges]
 *     summary: Get specific medium challenge
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Challenge details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 question:
 *                   type: string
 *       400:
 *         description: Challenge not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */


router.get("/challenge/medium/:challengeId", authMiddleware, async (req, res) =>{
    const {challengeId} = req.params;
    const challenge = await Challenge.findOne({difficulty: "Medium", _id: challengeId});
    
    try{

        if(!challenge){
        return res.status(400).json({message: "challenge not found"});
        }

        res.status(200).json({
            title: challenge.title,
            question: challenge.description
        })
    } catch(err){
        res.status(500).json({message: "Could not retrieve challenge", error: err.message})
    }
})

/**
 * @swagger
 * /api/challenge/hard/{challengeId}:
 *   get:
 *     tags: [Challenges]
 *     summary: Get specific hard challenge
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Challenge details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 question:
 *                   type: string
 *       400:
 *         description: Challenge not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.get("/challenge/hard/:challengeId", authMiddleware, async (req, res) =>{
    const {challengeId} = req.params;
    const challenge = await Challenge.findOne({difficulty: "Hard", _id: challengeId});
    try{
        if(!challenge){
            res.status(400).json({message: "challenge does not exist"});
        }
        res.status(200).json({title: challenge.title, question: challenge.description})
    } catch(err){
        res.status(500).json({message: "could not retrieve challenge", error: err.message});
    }
})

//answer question

/**
 * @swagger
 * /api/challenge/{challengeId}/{villainId}/submit:
 *   post:
 *     tags: [Challenges]
 *     summary: Submit solution for a challenge
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *       - in: path
 *         name: villainId
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439012"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codesnippet:
 *                 type: string
 *                 example: "function sum(arr) { return arr.reduce((a,b) => a + b, 0); }"
 *     responses:
 *       200:
 *         description: Correct solution
 *         content:
 *           application/json:
 *             example:
 *               message: "Correct!"
 *       400:
 *         description: Invalid solution or empty code
 *         content:
 *           application/json:
 *             examples:
 *               emptyCode:
 *                 value:
 *                   message: "cannot leave codesnippet blank"
 *               failedTest:
 *                 value:
 *                   message: "incorrect, code has failed the test"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Challenge not found
 *       500:
 *         description: Server error
 */

router.post("/challenge/:challengeId/:villainId/submit", authMiddleware, async (req, res) =>{
    const {challengeId, villainId} = req.params;
    const {codesnippet} = req.body;
    const userId = req.user.id

    try{
        const challenge = await Challenge.findById({_id: challengeId});
        const villain = await Villain.findById({_id: villainId});
        if(!challenge){
            return res.status(404).json({message: "challenge not found"});
        }

        
    if(!codesnippet || codesnippet.trim() == ""){
        return res.status(400).json({message: "cannot leave codensippet blank"});
    }

    const {testCases} = challenge;

    if(!testCases || testCases.length === 0){
        return res.status(400).json({message: "there are no test cases for this problem."})
    }
    const isValid = testCodeSnippet(codesnippet, testCases);
    if(isValid){
        if(!challenge.solutions.includes(codesnippet)){
            challenge.solutions.push(codesnippet);
        }
        rewardUserWithRupees(userId);
        challenge.codesnippet = "";
        console.log(villain);
        villain.hp -= 5;
        await villain.save();
        await challenge.save();
        return res.status(200).json({message: "Correct!"});
    } else{
        loseXp(userId);
        return res.status(400).json({message: "incorrect, code has failed the test"});
    }
    } catch (err){
        res.status(500).json({message: "there was an error submitting the question", error: err.message})
    }
    
})

// ================== ADMIN ROUTES ================== //

/**
 * @swagger
 * /api/challenge/create:
 *   post:
 *     tags: [Admin Challenges]
 *     summary: Create new challenge (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Challenge'
 *     responses:
 *       201:
 *         description: Challenge created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Challenge'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (non-admin)
 *       500:
 *         description: Server error
 */


router.post("/challenge/create", adminMiddleware, async (req, res) =>{

    try{
        const challenge = new Challenge({
            title: req.body.title,
            description: req.body.description,
            difficulty: req.body.difficulty
        })
        await challenge.save();
        res.status(201).json(challenge);
    } catch(err){
        res.status(500).json({message: "could not create habit", error: err.message});
    }

    

})

/**
 * @swagger
 * /api/challenge/edit/{challengeId}:
 *   put:
 *     tags: [Admin Challenges]
 *     summary: Edit challenge (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Challenge'
 *     responses:
 *       200:
 *         description: Challenge updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Challenge'
 *       400:
 *         description: Challenge not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (non-admin)
 *       500:
 *         description: Server error
 */

router.put("/challenge/edit/:challengeId", adminMiddleware, async (req, res) =>{
    const {challengeId} = req.params;
   const updatedData = req.body;

   try{
    const updatedChallenge = await Challenge.findByIdAndUpdate(challengeId, updatedData, {
        new: true,
        runValidators: true
    })
    if(!updatedChallenge){
        return res.status(400).json({message: "Challenge not found"})
    }
    res.status(200).json(updatedChallenge)
   } catch (err){
    res.status(500).json({message: "Could not update challenge", message: err.message})
   }
})


/**
 * @swagger
 * /api/challenge/{challengeId}:
 *   delete:
 *     tags: [Admin Challenges]
 *     summary: Delete challenge (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Challenge deleted
 *         content:
 *           application/json:
 *             example:
 *               message: "challenge successfully deleted"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (non-admin)
 *       404:
 *         description: Challenge not found
 *       500:
 *         description: Server error
 */

router.delete("/challenge/:challengeId", adminMiddleware, async (req, res) =>{
    const {challengeId} = req.params
    try{
        const challenge = await Challenge.deleteOne({_id: challengeId});
        if(!challenge){
            return res.status(404).json({message: "Challenge not found"})
        }
        res.status(200).json({message: "challenge successfully deleted"})
    } catch (err) {
        res.status(500).json({message: "could not delete challenge", error: err.message});
    }
})




module.exports = router


