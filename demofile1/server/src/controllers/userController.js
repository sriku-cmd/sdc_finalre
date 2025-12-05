const User = require('../models/User');
const { createNotification } = require('./notificationController');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('followers', 'username avatar')
            .populate('following', 'username avatar');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.bio = req.body.bio || user.bio;
        user.avatar = req.body.avatar || user.avatar;

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            bio: updatedUser.bio,
            avatar: updatedUser.avatar,
            token: req.body.token // Keep existing token if passed, or handle on client
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.followUser = async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            return res.status(400).json({ message: 'You cannot follow yourself' });
        }

        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!userToFollow.followers.includes(req.user.id)) {
            userToFollow.followers.push(req.user.id);
            currentUser.following.push(req.params.id);

            await userToFollow.save();
            await currentUser.save();

            // Create notification
            await createNotification(req.params.id, req.user.id, 'follow');

            res.json({ message: 'User followed' });
        } else {
            res.status(400).json({ message: 'You already follow this user' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            return res.status(400).json({ message: 'You cannot unfollow yourself' });
        }

        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToUnfollow || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userToUnfollow.followers.includes(req.user.id)) {
            userToUnfollow.followers = userToUnfollow.followers.filter(
                (id) => id.toString() !== req.user.id
            );
            currentUser.following = currentUser.following.filter(
                (id) => id.toString() !== req.params.id
            );

            await userToUnfollow.save();
            await currentUser.save();

            res.json({ message: 'User unfollowed' });
        } else {
            res.status(400).json({ message: 'You do not follow this user' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.searchUsers = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.json([]);
        }

        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        })
            .select('username email avatar')
            .limit(10);

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
