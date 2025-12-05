import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/users/`;

// Get user profile
export const getUserProfile = createAsyncThunk('user/getProfile', async (userId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(API_URL + 'profile/' + userId, config);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Follow user
export const followUser = createAsyncThunk('user/follow', async (userId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        await axios.put(API_URL + userId + '/follow', {}, config);
        return userId;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Unfollow user
export const unfollowUser = createAsyncThunk('user/unfollow', async (userId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        await axios.put(API_URL + userId + '/unfollow', {}, config);
        return userId;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Update user profile
export const updateUserProfile = createAsyncThunk('user/updateProfile', async (profileData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.put(API_URL + 'profile', profileData, config);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userProfile: null,
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: '',
    },
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userProfile = action.payload;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userProfile = action.payload;
                state.isSuccess = true;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(followUser.fulfilled, (state, action) => {
                // Optimistically update followers list if viewing that profile
                if (state.userProfile && state.userProfile._id === action.payload) {
                    // Logic to add current user to followers would go here, 
                    // but simpler to just re-fetch or let UI handle it
                }
            })
            .addCase(unfollowUser.fulfilled, (state, action) => {
                // Optimistic update logic
            });
    },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
