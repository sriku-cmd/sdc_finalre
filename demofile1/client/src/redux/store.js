import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import postReducer from './postSlice';
import userReducer from './userSlice';
import notificationReducer from './notificationSlice';
import messageReducer from './messageSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        post: postReducer,
        user: userReducer,
        notification: notificationReducer,
        message: messageReducer,
    },
});
