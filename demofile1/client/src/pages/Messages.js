import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { sendMessage, getConversation, getConversations } from '../redux/messageSlice';
import axios from 'axios';

function Messages() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);
    const { conversations, currentConversation } = useSelector((state) => state.message);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        dispatch(getConversations());

        if (location.state?.userProfile) {
            const userProfile = location.state.userProfile;
            setSelectedChat(userProfile);
            dispatch(getConversation(userProfile._id));
        }
    }, [user, navigate, dispatch, location.state]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentConversation]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText.trim() && !mediaFile) return;

        let mediaUrl = '';

        if (mediaFile) {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', mediaFile);

            try {
                const token = user.token;
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                };
                const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/upload`, formData, config);
                mediaUrl = data.filePath;
            } catch (error) {
                console.error('Media upload failed:', error);
                setIsUploading(false);
                return;
            }
            setIsUploading(false);
        }

        await dispatch(sendMessage({
            recipient: selectedChat._id,
            content: messageText,
            media: mediaUrl
        }));

        setMessageText('');
        setMediaFile(null);
        setMediaPreview('');
    };

    const handleSelectChat = (conv) => {
        const otherUser = conv.lastMessage?.sender?._id === user._id
            ? conv.lastMessage.recipient
            : conv.lastMessage.sender;

        setSelectedChat({ ...userData, _id: otherUser._id }); // Ensure ID is preserved
        // Actually, we need the full user object for the header. 
        // The aggregation might not return full user details in 'otherUser' variable if not populated correctly or if structure differs.
        // Let's rely on what we have.
        // Wait, the previous logic was:
        // const userData = conv.lastMessage?.sender?._id === user._id ? conv.lastMessage.recipient : conv.lastMessage.sender;
        // setSelectedChat({ ...userData, _id: otherUser });

        // Let's stick to the previous logic but clean it up.
        const userData = conv.lastMessage?.sender?._id === user._id
            ? conv.lastMessage.recipient
            : conv.lastMessage.sender;

        setSelectedChat(userData);
        dispatch(getConversation(userData._id));
    };

    const handleMediaSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMediaFile(file);
            setMediaPreview(URL.createObjectURL(file));
        }
    };

    const removeMedia = () => {
        setMediaFile(null);
        setMediaPreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200" style={{ height: 'calc(100vh - 8rem)' }}>
                    <div className="grid grid-cols-3 h-full">
                        {/* Conversations List */}
                        <div className="col-span-1 border-r border-gray-200 flex flex-col bg-gray-50/50">
                            <div className="p-4 border-b border-gray-200 bg-white">
                                <h2 className="text-xl font-bold text-slate-800">Messages</h2>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {conversations.length > 0 ? (
                                    conversations.map((conv) => {
                                        const otherUser = conv.lastMessage?.sender?._id === user._id
                                            ? conv.lastMessage.recipient
                                            : conv.lastMessage.sender;

                                        return (
                                            <div
                                                key={conv._id}
                                                onClick={() => handleSelectChat(conv)}
                                                className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-white ${selectedChat?._id === otherUser?._id
                                                    ? 'bg-white border-l-4 border-l-slate-600 shadow-sm'
                                                    : ''
                                                    }`}
                                            >
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white font-semibold mr-3 shadow-sm">
                                                        {otherUser?.avatar ? (
                                                            <img src={otherUser.avatar} alt={otherUser.username} className="w-full h-full rounded-full object-cover" />
                                                        ) : (
                                                            otherUser?.username?.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-slate-800 truncate">{otherUser?.username}</h3>
                                                        <p className="text-sm text-gray-500 truncate">
                                                            {conv.lastMessage?.media ? '📷 Photo' : conv.lastMessage?.content}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                        <div className="text-4xl mb-3 text-gray-300">📭</div>
                                        <p className="text-gray-500 font-medium">No messages yet</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 flex flex-col bg-white">
                            {selectedChat ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-4 border-b border-gray-200 bg-white flex items-center shadow-sm z-10">
                                        <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                            {selectedChat.avatar ? (
                                                <img src={selectedChat.avatar} alt={selectedChat.username} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                selectedChat.username?.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{selectedChat.username}</h3>
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                                        {currentConversation.length > 0 ? (
                                            currentConversation.map((msg) => (
                                                <div
                                                    key={msg._id}
                                                    className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-md px-4 py-2 rounded-2xl shadow-sm ${msg.sender._id === user._id
                                                            ? 'bg-slate-700 text-white rounded-br-none'
                                                            : 'bg-white text-slate-800 border border-gray-200 rounded-bl-none'
                                                            }`}
                                                    >
                                                        {msg.media && (
                                                            <img src={msg.media} alt="Shared media" className="rounded-lg mb-2 max-w-full" />
                                                        )}
                                                        {msg.content && <p className="text-sm">{msg.content}</p>}
                                                        <p className={`text-[10px] mt-1 text-right ${msg.sender._id === user._id ? 'text-slate-300' : 'text-gray-400'}`}>
                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <p className="text-gray-400 text-sm">Start the conversation</p>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Message Input */}
                                    <div className="p-4 border-t border-gray-200 bg-white">
                                        {mediaPreview && (
                                            <div className="mb-3 relative inline-block">
                                                <img src={mediaPreview} alt="Preview" className="h-20 rounded-lg border border-gray-200" />
                                                <button
                                                    onClick={removeMedia}
                                                    className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-slate-900"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                        <form onSubmit={handleSendMessage} className="flex gap-3">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleMediaSelect}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="p-3 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                                            >
                                                📎
                                            </button>
                                            <input
                                                type="text"
                                                value={messageText}
                                                onChange={(e) => setMessageText(e.target.value)}
                                                placeholder="Type a message..."
                                                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition-all bg-gray-50"
                                            />
                                            <button
                                                type="submit"
                                                disabled={isUploading}
                                                className={`bg-slate-700 text-white px-6 py-2 rounded-full hover:bg-slate-800 font-medium shadow-sm transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {isUploading ? '...' : 'Send'}
                                            </button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center bg-gray-50">
                                    <div className="text-center">
                                        <div className="text-6xl mb-4 text-gray-200">💬</div>
                                        <h3 className="text-lg font-medium text-gray-600">Select a conversation</h3>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Messages;
