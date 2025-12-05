const express = require('express');
const router = express.Router();
const { getUserProfile, updateProfile, followUser, unfollowUser, searchUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/search').get(searchUsers);
router.route('/profile/:id').get(protect, getUserProfile);
router.route('/profile').put(protect, updateProfile);
router.route('/:id/follow').put(protect, followUser);
router.route('/:id/unfollow').put(protect, unfollowUser);

module.exports = router;
