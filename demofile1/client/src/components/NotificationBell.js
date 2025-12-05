import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getNotifications, markNotificationsAsRead } from '../redux/notificationSlice';

function NotificationBell() {
    const dispatch = useDispatch();
    const { notifications } = useSelector((state) => state.notification);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        dispatch(getNotifications());
        // Poll for notifications every 30 seconds
        const interval = setInterval(() => {
            dispatch(getNotifications());
        }, 30000);
        return () => clearInterval(interval);
    }, [dispatch]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleToggle = () => {
        if (!isOpen && unreadCount > 0) {
            dispatch(markNotificationsAsRead());
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            <button
                onClick={handleToggle}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
                <span className="text-2xl">🔔</span>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-100 animate-fade-in">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h3 className="font-bold text-gray-700">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div key={notification._id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                            {(notification.sender?.username || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-800">
                                                <span className="font-bold">{notification.sender?.username}</span>
                                                {' '}
                                                {notification.type === 'like' && 'liked your post'}
                                                {notification.type === 'comment' && 'commented on your post'}
                                                {notification.type === 'follow' && 'started following you'}
                                                {notification.type === 'message' && 'sent you a message'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                No notifications yet
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
