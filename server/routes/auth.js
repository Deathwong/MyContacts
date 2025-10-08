import express from "express";
import User from "../models/User.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config.js"

const router = express.Router();

// Register the new user
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account using an email and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: mySecret123
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Bad request — user already exists or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User already exists
 */
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
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user with their email and password and returns a JWT token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: mySecret123
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token to authenticate further requests
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid credentials
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
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

        // Creation of the JWT
        const token = jwt.sign({email}, process.env.JWT_SECRET, { expiresIn: "1h" })

        res.status(201).json({token});
    } catch (error) {
        res.status(500).json({error: 'Server error'});
    }
});

// Logout
router.get("/logout", (req, res) => {
    res.clearCookie("jwtToken");
    res.status(200).json({message:"logout succesfull"});
});

export default router;