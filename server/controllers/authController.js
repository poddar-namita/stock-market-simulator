const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const errorMessage = (res, error) => {
    return res.status(400).json({ status: "fail", message: error.message });
};

exports.registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password) {
            return res.status(200).json({
                status: "fail",
                message: "Not all fields have been entered",
            });
        }
        if (password.length < 6 || password.length > 25) {
            return res.status(200).json({
                status: "fail",
                message: "Password must be between 6-25 characters",
                type: "password",
            });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(200).json({
                status: "fail",
                message: "An account with this username already exists.",
                type: "username",
            });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(200).json({
                status: "fail",
                message: "An account with this email already exists.",
                type: "email",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, password: hashedPassword, email });
        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
        return res.status(201).json({
            token,
            user: {
                username,
                id: savedUser._id,
                balance: savedUser.balance,
            },
        });
        // res.status(201).json(savedUser);
    } catch (error) {
        return errorMessage(res, error);
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(200).json({
                status: "fail",
                message: "Not all fields have been entered.",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                status: "fail",
                message: "Invalid credentials. Please try again.",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(200).json({
                status: "fail",
                message: "Invalid credentials. Please try again.",
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        return res.status(200).json({
            token,
            user: {
                username: user.username,
                id: user._id,
                balance: user.balance,
            },
        });
    } catch (error) {
        return errorMessage(res, error);
    }
};

exports.validate = async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) {
            return res.json(false);
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.json(false);
        }

        const user = await User.findById(verified.id);
        if (!user) {
            return res.json(false);
        }

        return res.json(true);
    } catch (error) {
        return res.json(false);
    }
};
