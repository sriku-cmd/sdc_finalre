const Post = require('../models/Post');
const redisClient = require('../utils/redisClient');
const { createNotification } = require('./notificationController');

exports.createPost = async (req, res) => {
    try {
        const { content, media } = req.body;
        const post = await Post.create({
            user: req.user.id,
            content,
            media
        });

        // Invalidate cache
        // Invalidate cache
        if (redisClient.isOpen) {
            await redisClient.del('posts');
        }

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        if (redisClient.isOpen) {
            const cachedPosts = await redisClient.get('posts');
            if (cachedPosts) {
                return res.json(JSON.parse(cachedPosts));
            }
        }

        const posts = await Post.find()
            .populate('user', 'username avatar')
            .sort({ createdAt: -1 });

        if (redisClient.isOpen) {
            await redisClient.set('posts', JSON.stringify(posts), {
                EX: 60
            });
        }

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.likes.includes(req.user.id)) {
            post.likes = post.likes.filter(id => id.toString() !== req.user.id);
        } else {
            post.likes.push(req.user.id);
            // Create notification
            await createNotification(post.user, req.user.id, 'like', post._id);
        }

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.commentPost = async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = {
            user: req.user.id,
            text
        };

        post.comments.push(comment);
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { content, media } = req.body;
        post.content = content || post.content;
        post.media = media || post.media;

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
