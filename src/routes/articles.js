import express from 'express';
const router = express.Router();
import Article from '../models/Article.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';
import { auth, adminAuth } from '../middleware/auth.js';
import { getDailyHeadlines, getEverythingMatching, convertArticle } from '../newsapi.js';

router.get('/', async (req, res) => {
    try {
        // Get n parameter
        const n = req.query.n || 20;
        // Get articles sorted by date (newest first)
        const internalArticles = await Article.find().sort({ createdAt: -1 }).limit(n);
        console.log("Articles fetched")
        res.status(200).json({ internalArticles });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/', adminAuth, async (req, res) => {
    try {
        const { title, content, url, author } = req.body;
        const newArticle = new Article({
            title,
            content,
            url,
            author
        });

        await newArticle.save();

        res.status(201).json({ article: newArticle });
        return;

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.put('/:id', adminAuth, async (req, res) => {
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

router.delete('/:id', adminAuth, async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        console.log("Deleting article with id: " + req.params.id);
        res.status(200).json({ message: 'Article deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// /like?id=1234
router.post('/like', auth, async (req, res) => {
    try {
        const { userId } = req;
        const articleId = req.query.id;
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

// /unlike?id=1234
router.post('/unlike', auth, async (req, res) => {
    try {
        const { userId } = req;
        const articleId = req.query.id;
        const user = await user.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        if (!user.likedArticles.includes(articleId)) {
            return res.status(400).json({ message: 'Article not liked' });
        }

        user.likedArticles = user.likedArticles.filter(id => id !== articleId);
        await user.save();

        article.likes -= 1;
        await article.save();

        res.status(200).json({ message: 'Article unliked' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// /save?id=1234
router.post('/save', auth, async (req, res) => {
    try {
        const { userId } = req;
        const articleId = req.query.id;

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

// /comment?id=1234
router.post('/comment', auth, async (req, res) => {
    try {
        const { userId } = req;
        const articleId = req.query.id;
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

        // Make a new Comment
        const comment = new Comment({
            user: userId,
            text: text,
            username: user.name,
            //article: articleId
        });
        await comment.save();
        console.log(comment);
        article.comments.push(comment);
        await article.save();

        res.status(200).json({ message: 'Comment added' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.delete('/comment/:id', auth, async (req, res) => {
    // DELETE /comment/COMMENTID=
    try {
        const { userId } = req;
        const commentId = req.params.id;

        // Check if user is admin or comment author
        const user = User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isAdmin) {

            const comment = Comment.findById(commentId);

            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            if (comment.user !== userId) {
                return res.status(403).json({ message: 'Unauthorized' });
            }
        }

        Comment.findByIdAndDelete(commentId);
        res.status(200).json({ message: 'Comment deleted' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/search', async (req, res) => {
    try {
        // Get query from url parameter
        const query = req.query.q;

        var results = {
            internal: [],
            external: []
        };

        const internalArticles = await Article.find({
            $text: {
                $search: query
            }
        });

        results.internal = internalArticles

        // internalArticles.map(article => {
        //     return {
        //         title: article.title,
        //         id: article._id,
        //         likes: article.likes
        //     };
        // });

        // TODO: change to everything endpoint
        var newsApiResults = await getEverythingMatching(query);

        console.log(newsApiResults)
        for (var i = 0; i < newsApiResults.length; i++) {
            const convertedArticle = convertArticle(newsApiResults[i]);
            results.external.push(convertedArticle);
            
            // Check if article with url already exists in db, if not, add it
            if (!(await Article.exists({ url: newsApiResults[i].url }))) {
                console.log('Article not in db, saving...');
                await convertedArticle.save();
                continue;
            } 

            try{
                // Load external article into db if not already present
                await Article.findOneAndUpdate({ url: newsApiResults[i].url }, {
                    title: newsApiResults[i].title,
                    imageUrl: newsApiResults[i].urlToImage,
                    author: newsApiResults[i].author,
                    content: newsApiResults[i].content,
                }, { upsert: true });
            } catch (error) {
                console.log(error);
            }
            
        }

        res.status(200).json({ results });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Keep this last to avoid conflicts with other routes
router.get('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        const articleComments = []
        for (var i = 0; i < article.comments.length; i++) {
            const comment = await Comment.findById(article.comments[i]);
            articleComments.push(comment);
        }

        article.comments = articleComments;

        res.status(200).json({ article });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;
