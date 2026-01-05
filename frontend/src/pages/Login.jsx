import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import NotificationCard from '../components/NotificationCard';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Login = () => {
    const [state, setState] = useState('Login'); // 'Login' or 'Sign Up'
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [notification, setNotification] = useState({ type: '', message: '', show: false });

    const navigate = useNavigate();
    const { backendUrl, token, setToken } = useContext(AppContext);

    // Redirect if already logged in
    useEffect(() => {
        if (token) navigate('/');
    }, [token, navigate]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ type, message, show: true });
        setTimeout(() => setNotification({ ...notification, show: false }), 3000);
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const url = state === 'Sign Up' ? '/api/user/register' : '/api/user/login';
            
            // FIX 1: Trim whitespace from email and name to prevent authentication errors
            const trimmedEmail = formData.email.trim();
            const trimmedName = formData.name.trim();

            const payload = state === 'Sign Up'
                ? { 
                    name: trimmedName, 
                    email: trimmedEmail, 
                    password: formData.password // Password should not be trimmed here
                }
                : { 
                    email: trimmedEmail, 
                    password: formData.password 
                };

            const { data } = await axios.post(backendUrl + url, payload);

            if (data.success) {
                localStorage.setItem('token', data.token);
                setToken(data.token);

                showNotification(`${state} successful`, 'success');

                setTimeout(() => navigate('/'), 200);
            } else {
                showNotification(data.message, 'error');
            }
        } catch (error) {
            
            // FIX 2: Enhanced error message for Network/Connection issues
            let errorMessage = error.response?.data?.message || error.message;

            if (error.code === 'ERR_NETWORK' || errorMessage.includes('connection refused')) {
                errorMessage = "Could not connect to the server. Please ensure the backend server is running on " + backendUrl;
            } else if (errorMessage.includes('401') || errorMessage.includes('403')) {
                // Keep the original invalid credentials message if it's a standard auth error
                errorMessage = error.response?.data?.message || "Authentication failed. Check your email and password.";
            }

            showNotification(errorMessage, 'error');
        }
    };

    return (
        <>
            {notification.show && (
                <NotificationCard
                    type={notification.type}
                    title={notification.type === 'success' ? 'Success!' : 'Error!'}
                    message={notification.message}
                    onClose={() => setNotification({ ...notification, show: false })}
                />
            )}

            <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
                <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
                    <p className='text-2xl font-semibold'>
                        {state === 'Sign Up' ? 'Create Account' : 'Login'}
                    </p>
                    <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book tickets</p>

                    {state === 'Sign Up' && (
                        <div className='w-full'>
                            <p>Full Name</p>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                                type="text"
                                required
                            />
                        </div>
                    )}

                    <div className='w-full'>
                        <p>Email</p>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className='border border-[#DADADA] rounded w-full p-2 mt-1'
                            type="email"
                            required
                        />
                    </div>

                    <div className='w-full relative'>
                        <p>Password</p>
                        <input
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className='border border-[#DADADA] rounded w-full p-2 mt-1 pr-10'
                            type={showPass ? 'text' : 'password'}
                            required
                        />
                        <span
                            className='absolute right-3 top-[38px] cursor-pointer text-xl text-gray-600'
                            onClick={() => setShowPass(prev => !prev)}
                        >
                            {showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </span>
                    </div>

                    <button className='bg-green-600 text-white w-full py-2 my-2 rounded-md text-base'>
                        {state === 'Sign Up' ? 'Create account' : 'Login'}
                    </button>

                    {state === 'Sign Up' ? (
                        <p>
                            Already have an account?{' '}
                            <span
                                onClick={() => setState('Login')}
                                className='text-primary underline cursor-pointer'
                            >
                                Login here
                            </span>
                        </p>
                    ) : (
                        <p>
                            Create a new account?{' '}
                            <span
                                onClick={() => setState('Sign Up')}
                                className='text-primary underline cursor-pointer'
                            >
                                Click here
                            </span>
                        </p>
                    )}
                </div>
            </form>
        </>
    );
};

export default Login;