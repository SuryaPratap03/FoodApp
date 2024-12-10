import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = ({ user = null }) => {
  return (
    <nav className="bg-green-700 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <NavLink to="/">
          <h1 className="text-2xl font-bold text-white">FoodMania</h1>
        </NavLink>
        <div className="flex space-x-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-gray-200 hover:text-white transition duration-300 font-semibold ${
                isActive ? "font-bold border-b-2 border-white" : ""
              }`
            }
          >
            Home
          </NavLink>
          {user ? ( // Check if user is logged in
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `text-gray-200 hover:text-white transition duration-300 font-semibold ${
                  isActive ? "font-bold border-b-2 border-white" : ""
                }`
              }
              >
              Profile
            </NavLink>
          ) : ( // If user is not logged in
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-gray-200 hover:text-white transition duration-300 font-semibold ${
                    isActive ? "font-bold border-b-2 border-white" : ""
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `text-gray-200 hover:text-white transition duration-300 font-semibold ${
                    isActive ? "font-bold border-b-2 border-white" : ""
                  }`
                }
              >
                Signup
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
