const express = require("express");
const {authMiddleware} = require("../middleware/authMiddleWare")
const router = express.Router();
const Villain = require("../models/Villain");


/* tags:
 *   - name: Villains
 *     description: Villain operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Villain:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         name:
 *           type: string
 *           example: "Dark Coder"
 *         description:
 *           type: string
 *           example: "A villain who corrupts code"
 *         hp:
 *           type: number
 *           example: 100
 *         difficulty:
 *           type: string
 *           enum: [Easy, Medium, Hard]
 *           example: "Medium"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/villains/{villainId}:
 *   get:
 *     tags: [Villains]
 *     summary: Get villain by ID
 *     description: Retrieve details of a specific villain
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: villainId
 *         required: true
 *         schema:
 *           type: string
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Villain details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Villain'
 *       401:
 *         description: Unauthorized or villain not found
 *         content:
 *           application/json:
 *             example:
 *               message: "no villains found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: "there was a problem retrieving the villain"
 *               error: "Detailed error message"
 */


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