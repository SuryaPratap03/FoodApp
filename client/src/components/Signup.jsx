import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = ({ setUser,fetchUser }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setErrorMessage(''); // Clear previous error messages

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        fetchUser();
        setUser(data.user); // Set the user state in the parent component
        navigate('/'); // Navigate to home after successful signup
        alert(`Welcome ${data.user.username}, your account has been created!`);
      } else {
        setErrorMessage(`Signup failed, ${data}`);
        console.error("Signup failed:", data);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-10">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-600">Create an Account</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow-md appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-green-500 focus:ring focus:ring-green-200 transition duration-200"
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow-md appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-green-500 focus:ring focus:ring-green-200 transition duration-200"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow-md appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-green-500 focus:ring focus:ring-green-200 transition duration-200"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
          )}

          <div className="flex items-center justify-center">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-200"
              type="submit"
            >
              Signup
            </button>
          </div>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-green-600 hover:text-green-500 font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
