import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                // Update the user state in the App component
                setUser(data.user);
                
                navigate('/');
                alert(`Welcome back ${data.user.username}`);
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-200">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-10">
                <h2 className="text-3xl font-bold text-center mb-6 text-green-600">Welcome Back!</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow-md appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-green-500 focus:ring focus:ring-green-200 transition duration-200"
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow-md appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-green-500 focus:ring focus:ring-green-200 transition duration-200"
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-center">
                        <button
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-200"
                            type="submit"
                        >
                            Login
                        </button>
                    </div>
                </form>

                <p className="text-center text-gray-600 text-sm mt-4">
                    Don't have an account?{' '}
                    <a href="/signup" className="text-green-600 hover:text-green-500 font-semibold">
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
