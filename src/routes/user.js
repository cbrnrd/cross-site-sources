import express from 'express';
const router = express.Router();
import Article from '../models/Article.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

// Routes relating to users. These are the routes that are used to create, view, and update users.

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        try {
            const user = await User.findById(req.params.id);
            // TODO: Check if requesting user is the same as the user being requested.
            // If not, do not return the email address and password.
            
            if (!user) {
                console.log('User with id ' + req.params.id + ' not found');
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ 
                user: {
                    id: user._id,
                    name: user.name,
                    likedArticles: user.likedArticles,
                    comments: user.comments
                }
             });
        } catch (error) {
            console.log(error);
            return res.status(404).json({ message: 'User not found' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user._id.toString() !== req.user.userId) {
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
        if (user._id.toString() !== req.user.userId) {
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
