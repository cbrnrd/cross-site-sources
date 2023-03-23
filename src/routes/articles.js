const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const articles = await Article.find();
        res.status(200).json({ articles });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newArticle = new Article({
            title,
            content
        });

        await newArticle.save();

        res.status(201).json({ article: newArticle });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const updatedArticle = await Article.findByIdAndUpdate(req.params.id, {
            title,
            content
        }, { new: true });

        res.status(200).json({ article: updatedArticle });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Article deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/:id/like', auth, async (req, res) => {
    try {
        const { userId } = req;
        const articleId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        if (user.likedArticles.includes(articleId)) {
            return res.status(400).json({ message: 'Article already liked' });
        }

        user.likedArticles.push(articleId);
        await user.save();

        article.likes += 1;
        await article.save();

        res.status(200).json({ message: 'Article liked' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/:id/save', auth, async (req, res) => {
    try {
        const { userId } = req;
        const articleId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        if (user.savedArticles.includes(articleId)) {
            return res.status(400).json({ message: 'Article already saved' });
        }

        user.savedArticles.push(articleId);
        await user.save();

        res.status(200).json({ message: 'Article saved' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/:id/comment', auth, async (req, res) => {
    try {
        const { userId } = req;
        const articleId = req.params.id;
        const { text } = req.body;
        // Check if text is not ascii
        if (!/^[\x00-\x7F]*$/.test(text)) { // TODO: this is definitely not enough validation
            return res.status(400).json({ message: 'Comment must be ascii' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        const comment = {
            user: userId,
            text: text,
            createdAt: Date.now()
        };

        article.comments.push(comment);
        await article.save();

        res.status(200).json({ message: 'Comment added' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
