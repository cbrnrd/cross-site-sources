import express from 'express';
const router = express.Router();
import Article from '../models/Article.js';
import User from '../models/User.js';
import { auth, adminAuth } from '../middleware/auth.js';

// Routes relating to users. These are the routes that are used to create, view, and update users.

router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {

        const user = await User.findById(req.params.id);
        console.log("user:: ", user.name);
        if (!user) {
            console.log('User with id ' + req.params.id + ' not found');
            return res.status(404).json({ message: 'User not found' });
        }

        if (user._id.toString() !== req.userId) {
            res.status(200).json({
                user: {
                    id: user._id,
                    name: user.name,
                    likedArticles: user.likedArticles,
                    comments: user.comments
                }
            });
        } else {
            res.status(200).json({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    likedArticles: user.likedArticles,
                    savedArticles: user.savedArticles,
                    comments: user.comments
                }
            });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to update a user's email
router.post('/changeemail', auth, async (req, res) => {
    try {
        const {userId, email} = req.body
        const user = await User.findById(userId)
        console.log("userId:: ", userId)
        console.log("newEmail:: ", email)

        if (!user) {
            return res.status(400).json({ message: 'User does not exist'});
        }
        user.email = email
        await user.save();
        res.status(200).json({message: "Email successfully updated"});
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user._id.toString() !== req.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id/articles', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // we only want users to see their own articles
        if (user._id.toString() !== req.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const articles = await Article.find({ author: req.params.id });
        res.status(200).json({ articles });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
