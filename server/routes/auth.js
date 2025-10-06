import express from "express";
import User from "../models/User.js"
import bcrypt from "bcrypt";

const router = express.Router();

// Register the new user
router.post("/register", async function (req,
                                              res) {

    // Get the user
    const {email, password} = req.body;

    try {

        // Create and save the user
        const newUser = new User({email, password});
        await newUser.save();

        // Return message
        res.status(201).json({message: 'User registered successfully'})
    } catch (error) {
        res.status(400).json({error: 'User already exists'})
    }
});

// Login user
router.post("/login", async function(req,
                                          res){

    // Get the user
    const {email, password} = req.body;

    try {

        const user = await User.findOne({email});
        if (!user) {
            res.status(404).json({error: 'User not found'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials'});
        }

        res.status(201).json({message: 'User logged successfully'});
    } catch (error) {
        res.status(500).json({error: 'Server error'});
    }
});

export default router;