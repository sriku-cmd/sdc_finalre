import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../redux/authSlice';
import NotificationBell from './NotificationBell';
import SearchBar from './SearchBar';

function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
            <div className="container mx-auto px-6 py-3">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="text-2xl font-bold text-slate-800 group-hover:text-slate-900 transition-all">
                            SocioSphere
                        </div>
                        <span className="text-xl">🌐</span>
                    </Link>

                    {user && (
                        <div className="flex items-center space-x-2">
                            <Link
                                to="/"
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive('/')
                                    ? 'bg-slate-100 text-slate-800'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                🏠 Home
                            </Link>
                            <Link
                                to="/messages"
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive('/messages')
                                    ? 'bg-slate-100 text-slate-800'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                💬 Messages
                            </Link>
                        </div>
                    )}

                    <div>
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <NotificationBell />
                                <Link to={`/profile/${user._id}`} className="hidden md:flex items-center space-x-3 px-3 py-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                                    <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                                        {user.avatar ? <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" /> : user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-gray-700 font-medium">{user.username}</span>
                                </Link>
                                <button
                                    onClick={onLogout}
                                    className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-all duration-200 font-medium shadow-sm"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-3">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-slate-800 transition px-4 py-2 font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-slate-700 text-white px-5 py-2 rounded-lg hover:bg-slate-800 transition-all duration-200 font-medium shadow-sm"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search Bar - Show on all pages when logged in */}
                {user && (
                    <div className="mt-3">
                        <SearchBar />
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
