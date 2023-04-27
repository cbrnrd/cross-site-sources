import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const userByName = await User.findOne({ name });
        if (userByName) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            salt: salt,
            role: 'user'
        });

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id, role: newUser.role }, 'secret', { expiresIn: '1h' });

        res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 });
        res.status(200).json({ token });
        //res.status(201).json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    console.log(req.body);
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, 'secret', { expiresIn: '1h' });

        res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 });
        res.status(200).json({ token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/logout', (req, res) => {
    console.log('logout')
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({ message: 'Logged out' });
});

export default router;
