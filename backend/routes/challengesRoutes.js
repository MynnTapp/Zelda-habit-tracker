const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleWare");
const Challenge = require("../models/Challenge");
const router = express.Router();
const testCodeSnippet = require("../tests/code-tester")


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

router.post("/challenge/:challengeId/submit", authMiddleware, async (req, res) =>{
    const {challengeId} = req.params;
    const {codesnippet} = req.body;

    try{
        const challenge = await Challenge.findById({_id: challengeId});
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
        challenge.codesnippet = "";
        await challenge.save();
        return res.status(200).json({message: "Correct!"});
    } else{
        return res.status(400).json({message: "incorrect, code has failed the test"});
    }
    } catch (err){
        res.status(500).json({message: "there was an error submitting the question", error: err.message})
    }
    
})


module.exports = router


