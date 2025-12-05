import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../redux/authSlice';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const { username, email, password, confirmPassword } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            // Error handling
        }

        if (isSuccess || user) {
            navigate('/verify');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
        } else {
            dispatch(register(formData));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-sm border border-gray-200">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-800">
                        Create Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join SocioSphere today
                    </p>
                </div>
                <form className="mt-8 space-y-4" onSubmit={onSubmit}>
                    <div className="space-y-4">
                        <div>
                            <input
                                type="text"
                                name="username"
                                value={username}
                                onChange={onChange}
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm"
                                placeholder="Username"
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={onChange}
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-slate-500 focus:border-slate-500 focus:z-10 sm:text-sm"
                                placeholder="Confirm Password"
                            />
                        </div>
                    </div>

                    {isError && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
                            {message}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors shadow-sm"
                        >
                            {isLoading ? 'Creating account...' : 'Sign up'}
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <Link to="/login" className="font-medium text-slate-600 hover:text-slate-500">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
