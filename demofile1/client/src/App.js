import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <Router>
            <div className="min-h-screen">
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify" element={<Verify />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
                    <Route path="/" element={
                        <PrivateRoute>
                            <Feed />
                        </PrivateRoute>
                    } />
                    <Route path="/messages" element={
                        <PrivateRoute>
                            <Messages />
                        </PrivateRoute>
                    } />
                    <Route path="/profile/:id" element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
