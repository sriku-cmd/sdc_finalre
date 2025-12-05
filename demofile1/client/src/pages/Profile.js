import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile, followUser, unfollowUser, updateUserProfile } from '../redux/userSlice';

function Profile() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = React.useState(false);
    const [editBio, setEditBio] = React.useState('');
    const [editAvatar, setEditAvatar] = React.useState('');

    const { user: currentUser } = useSelector((state) => state.auth);
    const { userProfile, isLoading } = useSelector((state) => state.user);

    useEffect(() => {
        if (id) {
            dispatch(getUserProfile(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (userProfile) {
            setEditBio(userProfile.bio || '');
            setEditAvatar(userProfile.avatar || '');
        }
    }, [userProfile]);

    const handleFollow = () => {
        dispatch(followUser(id)).then(() => dispatch(getUserProfile(id)));
    };

    const handleUnfollow = () => {
        dispatch(unfollowUser(id)).then(() => dispatch(getUserProfile(id)));
    };

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        dispatch(updateUserProfile({ bio: editBio, avatar: editAvatar }));
        setShowEditModal(false);
    };

    const startConversation = () => {
        navigate('/messages', { state: { userProfile: userProfile } });
    };

    if (isLoading || !userProfile) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    const isFollowing = userProfile.followers.some(follower => follower._id === currentUser._id);
    const isMe = currentUser._id === userProfile._id;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
                    {/* Cover Image */}
                    <div className="bg-gradient-to-r from-slate-600 to-slate-800 h-48"></div>

                    <div className="px-8 pb-8">
                        {/* Profile Header */}
                        <div className="flex justify-between items-end -mt-16 mb-6">
                            <div className="w-32 h-32 bg-white rounded-full p-1 shadow-md">
                                <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center text-4xl font-bold text-slate-500 overflow-hidden">
                                    {userProfile.avatar ? (
                                        <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        userProfile.username.charAt(0).toUpperCase()
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 mb-2">
                                {!isMe && (
                                    <button
                                        onClick={isFollowing ? handleUnfollow : handleFollow}
                                        className={`px-6 py-2 rounded-lg font-medium transition-all shadow-sm ${isFollowing
                                            ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                            : 'bg-slate-800 text-white hover:bg-slate-900'
                                            }`}
                                    >
                                        {isFollowing ? 'Unfollow' : 'Follow'}
                                    </button>
                                )}
                                {isMe && (
                                    <button
                                        onClick={() => setShowEditModal(true)}
                                        className="px-6 py-2 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                                {!isMe && (
                                    <button
                                        onClick={startConversation}
                                        className="px-6 py-2 rounded-lg font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all shadow-sm flex items-center"
                                    >
                                        <span className="mr-2">✉️</span> Message
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-1">{userProfile.username}</h2>
                            <p className="text-gray-500 mb-4 flex items-center text-sm">
                                <span className="mr-2">📧</span>
                                {userProfile.email}
                            </p>
                            <p className="text-gray-700 leading-relaxed max-w-2xl">{userProfile.bio || 'No bio yet.'}</p>
                        </div>

                        {/* Stats */}
                        <div className="flex space-x-8 border-t border-gray-100 pt-6">
                            <div className="text-center">
                                <span className="block font-bold text-xl text-slate-800">
                                    {userProfile.followers.length}
                                </span>
                                <span className="text-gray-500 text-sm">Followers</span>
                            </div>
                            <div className="text-center">
                                <span className="block font-bold text-xl text-slate-800">
                                    {userProfile.following.length}
                                </span>
                                <span className="text-gray-500 text-sm">Following</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-xl border border-gray-100">
                        <h3 className="text-xl font-bold mb-6 text-slate-800">Edit Profile</h3>
                        <form onSubmit={handleUpdateProfile}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture URL</label>
                                <input
                                    type="text"
                                    value={editAvatar}
                                    onChange={(e) => setEditAvatar(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none transition-all"
                                    placeholder="https://example.com/avatar.jpg"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                <textarea
                                    value={editBio}
                                    onChange={(e) => setEditBio(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none h-32 resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 font-medium transition-colors shadow-sm"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
