const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
    try {
        const { recipient, content, media } = req.body;

        const message = await Message.create({
            sender: req.user._id,
            recipient,
            content,
            media
        });

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'username avatar')
            .populate('recipient', 'username avatar');

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getConversation = async (req, res) => {
    try {
        const { userId } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: req.user._id, recipient: userId },
                { sender: userId, recipient: req.user._id }
            ]
        })
            .populate('sender', 'username avatar')
            .populate('recipient', 'username avatar')
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getConversations = async (req, res) => {
    try {
        const messages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: req.user._id },
                        { recipient: req.user._id }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ['$sender', req.user._id] },
                            '$recipient',
                            '$sender'
                        ]
                    },
                    lastMessage: { $first: '$$ROOT' }
                }
            }
        ]);

        const populatedMessages = await Message.populate(messages, {
            path: 'lastMessage.sender lastMessage.recipient',
            select: 'username avatar'
        });

        res.json(populatedMessages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { userId } = req.params;

        await Message.updateMany(
            { sender: userId, recipient: req.user._id, read: false },
            { read: true }
        );

        res.json({ message: 'Messages marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
