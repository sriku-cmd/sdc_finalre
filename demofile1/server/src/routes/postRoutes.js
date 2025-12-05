const express = require('express');
const router = express.Router();
const { createPost, getPosts, likePost, commentPost, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createPost)
    .get(getPosts);

router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentPost);
router.route('/:id').put(protect, updatePost).delete(protect, deletePost);

module.exports = router;
