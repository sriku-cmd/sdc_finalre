import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getPosts, reset } from '../redux/postSlice';
import PostForm from '../components/PostForm';
import PostItem from '../components/PostItem';

function Feed() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('forYou');

    const { user } = useSelector((state) => state.auth);
    const { posts, isLoading, isError, message } = useSelector(
        (state) => state.post
    );

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }

        dispatch(getPosts());

        return () => {
            dispatch(reset());
        };
    }, [user, navigate, dispatch]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading your feed...</p>
                </div>
            </div>
        );
    }

    // Calculate trending posts
    const trendingPosts = [...(posts || [])].sort((a, b) => {
        const scoreA = a.likes.length + a.comments.length;
        const scoreB = b.likes.length + b.comments.length;
        return scoreB - scoreA;
    }).slice(0, 5);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Feed */}
                    <div className="flex-1 space-y-6">
                        {/* Welcome Banner */}
                        <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl shadow-sm p-8 text-white">
                            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.username}! 👋</h1>
                            <p className="text-slate-200 text-lg">Share your thoughts with the world</p>
                        </div>

                        {/* Post Creation */}
                        <PostForm />

                        {/* Feed Tabs */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="flex border-b border-gray-100">
                                <button
                                    onClick={() => setActiveTab('forYou')}
                                    className={`flex-1 py-4 px-6 font-medium transition-all duration-200 ${activeTab === 'forYou'
                                        ? 'text-slate-800 border-b-2 border-slate-700 bg-slate-50/50'
                                        : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    For You
                                </button>
                                <button
                                    onClick={() => setActiveTab('following')}
                                    className={`flex-1 py-4 px-6 font-medium transition-all duration-200 ${activeTab === 'following'
                                        ? 'text-slate-800 border-b-2 border-slate-700 bg-slate-50/50'
                                        : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    Following
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {posts && posts.length > 0 ? (
                                    posts.map((post) => (
                                        <PostItem key={post._id} post={post} />
                                    ))
                                ) : (
                                    <div className="text-center py-16">
                                        <div className="text-6xl mb-4 text-gray-200">📝</div>
                                        <p className="text-gray-500 text-lg font-medium">No posts yet</p>
                                        <p className="text-gray-400 mt-2">Be the first to share something!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-80 space-y-6 hidden lg:block">
                        {/* Trending Section */}
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 border border-gray-100">
                            <div className="flex items-center mb-6">
                                <span className="text-2xl mr-3">🔥</span>
                                <h2 className="text-xl font-bold text-slate-800">Trending</h2>
                            </div>
                            <div className="space-y-4">
                                {trendingPosts.length > 0 ? (
                                    trendingPosts.map((post, index) => (
                                        <div
                                            key={post._id}
                                            className="p-4 rounded-xl bg-amber-50/50 hover:bg-amber-50 transition-all duration-200 cursor-pointer border border-amber-100/50 hover:border-amber-200 group"
                                        >
                                            <div className="flex items-start">
                                                <span className="text-amber-500 font-bold mr-3 text-lg opacity-50 group-hover:opacity-100 transition-opacity">#{index + 1}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-gray-700 font-medium line-clamp-2 mb-2 group-hover:text-slate-900 transition-colors">
                                                        {post.content}
                                                    </p>
                                                    <div className="flex items-center text-xs text-gray-400 font-medium">
                                                        <span className="mr-4 flex items-center"><span className="mr-1">👍</span> {post.likes.length}</span>
                                                        <span className="flex items-center"><span className="mr-1">💬</span> {post.comments.length}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-center py-8">No trending posts yet</p>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-slate-800 rounded-xl shadow-sm p-6 text-white">
                            <h3 className="font-bold text-lg mb-4">Your Activity</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                                    <span className="text-slate-300">Total Posts</span>
                                    <span className="text-2xl font-bold">{posts?.filter(p => p.user?._id === user?._id).length || 0}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                                    <span className="text-slate-300">Engagement</span>
                                    <span className="text-2xl font-bold">
                                        {posts?.filter(p => p.user?._id === user?._id)
                                            .reduce((sum, p) => sum + p.likes.length + p.comments.length, 0) || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Feed;
