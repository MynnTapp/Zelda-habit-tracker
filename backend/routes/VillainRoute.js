const express = require("express");
const {authMiddleware} = require("../middleware/authMiddleWare")
const router = express.Router();
const Villain = require("../models/Villain");


router.get("/villains/:villainId", authMiddleware, async (req, res) =>{
    const {villainId} = req.params
    const villain = await Villain.findById({_id: villainId})
    try{
        if(!villain){
            res.status(401).json({message: "no villains found"})
            return;
        }
        res.status(200).json(villain);
    } catch (err){
        res.status(500).json({message: "there was a problem retrieving the villain", error: err.message})
    }
})

module.exports = router;