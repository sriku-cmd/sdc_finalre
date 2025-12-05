import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { likePost, commentPost, deletePost, updatePost } from '../redux/postSlice';

function PostItem({ post }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);

    const onLike = () => {
        dispatch(likePost(post._id));
    };

    const onComment = (e) => {
        e.preventDefault();
        dispatch(commentPost({ postId: post._id, text: commentText }));
        setCommentText('');
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            dispatch(deletePost(post._id));
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        dispatch(updatePost({ postId: post._id, content: editContent }));
        setIsEditing(false);
    };

    const isLiked = post.likes.includes(user?._id);
    const isMyPost = user?._id === post.user?._id;

    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 mb-4 border border-gray-100 transition-all duration-300">
            <div className="flex items-center mb-4">
                <Link to={`/profile/${post.user?._id || '#'}`} className="flex items-center group">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-md group-hover:scale-110 transition-transform duration-200">
                        {post.user?.avatar ? (
                            <img src={post.user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            (post.user?.username || 'U').charAt(0).toUpperCase()
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {post.user?.username || 'Unknown User'}
                        </h3>
                        <p className="text-gray-500 text-xs">
                            {new Date(post.createdAt).toLocaleString()}
                        </p>
                    </div>
                </Link>
            </div>

            {isEditing ? (
                <form onSubmit={handleUpdate} className="mb-4">
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        rows="3"
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            ) : (
                <p className="text-gray-800 mb-4 text-lg leading-relaxed">{post.content}</p>
            )}

            {post.media && (
                <div className="mb-4 rounded-xl overflow-hidden shadow-md">
                    <img
                        src={post.media.startsWith('http') ? post.media : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${post.media}`}
                        alt="Post media"
                        className="w-full max-h-96 object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}

            <div className="flex items-center text-gray-600 text-sm border-t border-gray-100 pt-4 gap-4">
                <button
                    onClick={onLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${isLiked
                        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        : 'hover:bg-gray-100 text-gray-600'
                        }`}
                >
                    <span className={`text-xl ${isLiked ? 'animate-bounce' : ''}`}>
                        {isLiked ? '❤️' : '🤍'}
                    </span>
                    <span>{post.likes.length}</span>
                </button>

                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 font-semibold transition-all duration-200"
                >
                    <span className="text-xl">💬</span>
                    <span>{post.comments.length}</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 font-semibold transition-all duration-200 ml-auto">
                    <span className="text-xl">🔗</span>
                    <span>Share</span>
                </button>

                {isMyPost && (
                    <div className="flex gap-2 ml-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            ✏️
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            🗑️
                        </button>
                    </div>
                )}
            </div>

            {showComments && (
                <div className="mt-6 border-t border-gray-100 pt-4 space-y-4">
                    <form onSubmit={onComment} className="flex gap-2">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-grow px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                            Post
                        </button>
                    </form>

                    <div className="space-y-3">
                        {post.comments.map((comment, index) => (
                            <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                        {(comment.user?.username || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-gray-800">{comment.user?.username || 'User'}</p>
                                        <p className="text-gray-700 mt-1">{comment.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostItem;
