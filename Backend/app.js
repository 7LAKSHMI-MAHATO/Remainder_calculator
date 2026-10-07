const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Calculation = require("./models/Calculation");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const protect = require("./middleware/authMiddleware");
const optionalAuth = require("./middleware/optionalAuth");



const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Remainder Calculator Backend is running");
});


// Register user
app.post("/api/auth/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email and password are required"
        });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.log("Registration error:", error.message);

        res.status(500).json({
            message: "Registration failed"
        });
    }
});

// Login user
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.log("Login error:", error.message);

        res.status(500).json({
            message: "Login failed"
        });
    }
});

// Protected test route
app.get("/api/auth/me", protect, (req, res) => {
    res.json({
        message: "Authentication successful",
        user: req.user
    });
});


// Calculate remainder
app.post("/api/calculate", optionalAuth, async (req, res) => {
    console.log("Calculate API called");
    const { dividend, divisor } = req.body;

    if (dividend === undefined || divisor === undefined) {
        return res.status(400).json({
            message: "Dividend and divisor are required"
        });
    }

    if (divisor === 0) {
        return res.status(400).json({
            message: "Divisor cannot be zero"
        });
    }

    const quotient = Math.floor(dividend / divisor);
    const remainder = dividend % divisor;

    try {
         console.log("Saving calculation to MongoDB...");
        const calculation = await Calculation.create({
            dividend,
            divisor,
            quotient,
            remainder
        });

    console.log("Calculation saved:", calculation);

        res.json({
            dividend,
            divisor,
            quotient,
            remainder,
            calculationId: calculation._id
        });
    } catch (error) {
        console.log("Database error:", error.message);

        res.status(500).json({
            message: "Failed to save calculation"
        });
    }
});

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected Successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error.message);
    });

module.exports = app;