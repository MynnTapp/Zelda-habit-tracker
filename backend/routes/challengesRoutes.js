const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleWare");
const Challenge = require("../models/Challenge");
const router = express.Router();

router.get("/challenge/easy", authMiddleware, async (req, res) =>{
    const challenge = await Challenge.find({ difficulty: "Easy" });
    try{
       res.status(200).json(challenge)
    } catch(err){
        res.status(500).json({message: "could not retrieve challenges", error: err.message})
    }
})

router.get("/challenge/medium", authMiddleware, async (req, res) =>{
    const challenge = await Challenge.find({difficulty: "Medium"});
    try{
        res.status(200).json(challenge);
    } catch(err){
        res.status(500).json({message: "could not retrieve challenges", error: err.message})
    }
})

router.get("/challenge/hard", authMiddleware, async (req, res) =>{
    const challenge = await Challenge.find({difficulty: "Hard"});
    try{
        res.status(200).json(challenge);
    } catch (err){
        res.status(500).json({message: "Could not retrieve challenges", error: err.message});
    }
})


//get certain level challenges, based on id

router.get("/challenge/easy/:challengeId", authMiddleware, async (req, res) =>{
    const {challengeId} = req.params;
    const challenge = await Challenge.findOne({difficulty: "Easy", _id: challengeId});

    try{
        if (!challenge) {
          return res.status(400).json({ message: "could not find challenge" });
        }
        res.status(200).json({
        title: challenge.title,
        question: challenge.description,
        });
        
    } catch(err){
        res.status(500).json({message: "could not retrieve challenge", error: err.message});
    }
    
})

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

module.exports = router


