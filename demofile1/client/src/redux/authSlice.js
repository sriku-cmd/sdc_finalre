import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/auth/`;

// Register user
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        const response = await axios.post(API_URL + 'register', userData);
        // Don't login immediately, wait for verification
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Verify user
export const verify = createAsyncThunk('auth/verify', async (userData, thunkAPI) => {
    try {
        const response = await axios.post(API_URL + 'verify', userData);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Resend code
export const resendCode = createAsyncThunk('auth/resendCode', async (userData, thunkAPI) => {
    try {
        const response = await axios.post(API_URL + 'resend-code', userData);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Login user
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        const response = await axios.post(API_URL + 'login', userData);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('user');
});

const user = JSON.parse(localStorage.getItem('user'));

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: user ? user : null,
        isError: false,
        isSuccess: false,
        isLoading: false,
        message: '',
    },
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Do not set user here, wait for verification
                state.message = action.payload.message;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(verify.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verify.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(verify.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            });
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
