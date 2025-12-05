import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/messages/`;

// Send message
export const sendMessage = createAsyncThunk('messages/send', async (messageData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(API_URL, messageData, config);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get conversation
export const getConversation = createAsyncThunk('messages/getConversation', async (userId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(API_URL + userId, config);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get all conversations
export const getConversations = createAsyncThunk('messages/getAll', async (_, thunkAPI) => {
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

const messageSlice = createSlice({
    name: 'message',
    initialState: {
        conversations: [],
        currentConversation: [],
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
        clearCurrentConversation: (state) => {
            state.currentConversation = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.currentConversation.push(action.payload);
            })
            .addCase(getConversation.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getConversation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentConversation = action.payload;
            })
            .addCase(getConversation.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getConversations.fulfilled, (state, action) => {
                state.conversations = action.payload;
            });
    },
});

export const { reset, clearCurrentConversation } = messageSlice.actions;
export default messageSlice.reducer;
