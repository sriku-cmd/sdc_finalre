import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/notifications/`;

// Get notifications
export const getNotifications = createAsyncThunk('notifications/getAll', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(API_URL, config);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Mark as read
export const markNotificationsAsRead = createAsyncThunk('notifications/markRead', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.put(API_URL + 'read', {}, config);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        notifications: [],
        isLoading: false,
        isError: false,
        message: '',
    },
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        },
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotifications.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.notifications = action.payload;
            })
            .addCase(getNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(markNotificationsAsRead.fulfilled, (state) => {
                state.notifications.forEach(n => n.read = true);
            });
    },
});

export const { reset, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
