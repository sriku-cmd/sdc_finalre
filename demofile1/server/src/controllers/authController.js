const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/emailService');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate 6-digit code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`[DEMO MODE] Verification Code for ${email}: ${verificationCode}`);
        const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        const user = await User.create({
            username,
            email,
            password,
            verificationCode,
            verificationCodeExpires,
            isVerified: false
        });

        if (user) {
            // Send verification email
            const subject = 'Verify your email';
            const text = `Your verification code is: ${verificationCode}`;
            await sendEmail(user.email, subject, text);

            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                // verificationCode: user.verificationCode, // REMOVED: Do not send code in response
                message: 'Registration successful. Please check your email for the verification code.'
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User already verified' });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        if (user.verificationCodeExpires < Date.now()) {
            return res.status(400).json({ message: 'Verification code expired' });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
            message: 'Email verified successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resendCode = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User already verified' });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`[DEMO MODE] New Verification Code for ${email}: ${verificationCode}`);
        const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

        user.verificationCode = verificationCode;
        user.verificationCodeExpires = verificationCodeExpires;
        await user.save();

        // Send verification email
        const subject = 'Verify your email';
        const text = `Your verification code is: ${verificationCode}`;
        await sendEmail(user.email, subject, text);

        res.json({
            message: 'Verification code resent. Please check your email.',
            // verificationCode // REMOVED: Do not send code in response
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            if (!user.isVerified) {
                return res.status(401).json({
                    message: 'Please verify your email first',
                    isNotVerified: true,
                    email: user.email
                });
            }

            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
