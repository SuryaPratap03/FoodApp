import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Favourites from './Favourites';
import Cart from './Cart';
import Setting from './Setting';

const Profile = ({ setUser, user, fetchUser }) => {
    const [isSelected, setIsSelected] = useState('favourite');
    const navigate = useNavigate(); // Initialize navigate

    const handleLogout = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to logout. Please try again.');
            }

            const data = await response.json();
            setUser(null); // Clear the user state
            alert("Logged out successfully!"); // Success alert
            navigate('/'); // Navigate to home page
        } catch (error) {
            console.error(error);
            alert(`Error: ${error.message}`); // Error alert
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-full md:w-1/4 bg-white border-r border-gray-300 flex flex-col items-center py-6 shadow-lg">
                {/* User Image */}
                <img
                    src="https://static.vecteezy.com/system/resources/previews/021/548/095/original/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg"
                    alt="User"
                    className="w-24 h-24 rounded-full mb-4"
                />
                <h2 className="text-xl font-bold mb-8 text-center">{user?.username}</h2>

                {/* Navigation Links */}
                <nav className="flex flex-col space-y-4 w-full">
                    {['favourite', 'cart', 'setting'].map((item) => (
                        <h1
                            key={item}
                            onClick={() => setIsSelected(item)}
                            className={`cursor-pointer p-3 text-center w-full transition-colors duration-300 ${
                                isSelected === item ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {item.charAt(0).toUpperCase() + item.slice(1)} {/* Capitalize the first letter */}
                        </h1>
                    ))}
                </nav>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="w-full md:w-3/4 p-6 overflow-y-auto">
                {isSelected === 'favourite' && <Favourites user={user} setUser={setUser} />}
                {isSelected === 'cart' && <Cart user={user} setUser={setUser} />}
                {isSelected === 'setting' && <Setting user={user} setUser={setUser} fetchUser={fetchUser} />}
            </div>
        </div>
    );
};

export default Profile;
