import React, { useState } from 'react';

const Setting = ({ user, setUser }) => {
  const [username, setUserName] = useState(user.username || ''); // Default to current username
  const [email, setEmail] = useState(user.email || ''); // Default to current email
  const [password, setPassword] = useState(''); // Password can be empty

  const handleChange = async (e) => {
    e.preventDefault();

    // Create an object to hold the updated fields
    const updatedFields = {};

    // Only add fields to the object if they have changed
    if (username !== user.username) {
      updatedFields.username = username;
    }
    if (email !== user.email) {
      updatedFields.email = email;
    }
    if (password) { // Include password only if it's not empty (you may choose to require confirmation for this)
      updatedFields.password = password;
    }

    // If no fields have changed, return early
    if (Object.keys(updatedFields).length === 0) {
      console.log('No changes to update');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/edituser`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure cookies are sent with the request
        body: JSON.stringify(updatedFields), // Send only updated fields
      });

      if (!response.ok) {
        throw new Error('Error updating user information');
      }

      const data = await response.json();
      console.log(data);

      // Update local user state with new username and email if they were changed
      setUser((prevUser) => ({
        ...prevUser,
        ...(username !== prevUser.username && { username }),
        ...(email !== prevUser.email && { email }),
      }));

      // Show success alert
      window.alert('Settings updated successfully!');

    } catch (error) {
      console.log('Error updating user information', error);
      window.alert('Failed to update settings. Please try again.'); // Optional: Alert for error case
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Edit Your Details</h1>
      <form className="space-y-4" onSubmit={handleChange}>
        <div>
          <label htmlFor="username" className="block text-gray-300 mb-1">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            name="username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          Update Settings
        </button>
      </form>
    </div>
  );
};

export default Setting;
