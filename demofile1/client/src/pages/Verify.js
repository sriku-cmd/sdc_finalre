import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { verify, resendCode, reset } from '../redux/authSlice';

function Verify() {
    const [code, setCode] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    // Get email from location state (passed from register) or local storage
    const email = location.state?.email || localStorage.getItem('registrationEmail');

    const { isLoading, isError, isSuccess, message, user } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }

        if (isError) {
            alert(message);
        }

        if (isSuccess && user) {
            alert('Verification successful!');
            navigate('/');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch, email]);

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(verify({ email, code }));
    };

    const onResend = () => {
        dispatch(resendCode({ email }))
            .unwrap()
            .then((payload) => {
                alert(payload.message);
            })
            .catch((error) => alert(error));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
                    <p className="mt-4 text-gray-600 font-medium text-lg">Verifying...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-fade-in-up">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🔐</div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Verify Your Email
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Enter the 6-digit code sent to <br />
                        <span className="font-semibold text-gray-700">{email}</span>
                    </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full px-4 py-4 text-center text-3xl tracking-widest border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all font-mono"
                            placeholder="000000"
                            maxLength="6"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                        Verify Account ✨
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600 mb-2">Didn't receive the code?</p>
                    <button
                        onClick={onResend}
                        className="text-purple-600 font-semibold hover:text-purple-700 transition-colors underline"
                    >
                        Resend Code
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Verify;
