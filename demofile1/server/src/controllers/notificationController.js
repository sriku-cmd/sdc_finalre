const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .populate('sender', 'username avatar')
            .populate('post', 'content')
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, read: false },
            { read: true }
        );
        res.json({ message: 'Notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper to create notification (internal use)
exports.createNotification = async (recipient, sender, type, post = null) => {
    try {
        if (recipient.toString() === sender.toString()) return; // Don't notify self

        await Notification.create({
            recipient,
            sender,
            type,
            post
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};
