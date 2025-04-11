import React, { useState } from 'react';
import { FaShoppingCart, FaUserCircle, FaSignOutAlt, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../authen/auth";
import { Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const {isAuthorized, logout, user} = useAuth(); 

 

  const handleLogout = () => {
    logout();
    navigate('/');
  };


  return (
    <div className="navbar bg-[#1b8057] shadow-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
      {/* Logo */}
    
      <div className="text-3xl font-bold text-white">
        <a href="/" className="hover:text-gray-200 transition duration-300">
          Aswad Grocery
        </a>
      </div>

      {/* Menu for large screens */}
      <div className="lg:flex items-center space-x-8 hidden">
        <ul className="lg:flex gap-8 text-white font-semibold">
          <li>
            <a href="/" className="hover:text-gray-200 transition duration-300"></a>
          </li>
          <li>
            <a href="/shop" className="hover:text-gray-200 transition duration-300">Shop</a>
          </li>
          <li>
            <a href="/about" className="hover:text-gray-200 transition duration-300">About</a>
          </li>
          <li>
            <a href="/contact" className="hover:text-gray-200 transition duration-300">Contact</a>
          </li>
          {/* Admin Dashboard Link */}
  
            <li>
              <Link to="/admin/dashboard" className="hover:text-gray-200 transition duration-300">Admin Dashboard</Link>
            </li>

        </ul>
      </div>

      {/* Right side icons */}
      <div className="flex items-center space-x-6">
        {/* Search bar */}
        <div className="hidden md:block">
          <input
            type="text"
            placeholder="Search groceries..."
            className="input input-bordered w-40 md:w-64 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* Cart Icon */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <FaShoppingCart className="text-2xl text-white" />
              <span className="badge badge-sm indicator-item bg-red-500 text-white">3</span>
            </div>
          </div>
          <div
            tabIndex={0}
            className="mt-3 z-[1] card card-compact dropdown-content bg-base-100 shadow w-64">
            <div className="card-body">
              <span className="font-bold text-lg">3 Items</span>
              <span className="text-[#1b8057]">Subtotal: $58.99</span>
              <div className="card-actions">
                <button className="btn btn-success btn-block">View Cart</button>
              </div>
            </div>
          </div>
        </div>
        {isAuthorized ? (
        <div>Hello, {user?.first_name} </div>): null}
        {/* User Icon */}
        <div className="relative">
            
          <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            {isAuthorized && user?.profile_picture ? (
                <img
                src={user.profile_picture}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
                />
            ) : (
                <FaUserCircle className="text-3xl text-white cursor-pointer" />
            )}
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-lg w-52">
              <li>
                <Link to="/profile" className="hover:bg-[#1b8057] hover:text-white p-2 flex items-center">
                  <FaUserCircle className="mr-2 text-xl" />
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/order" className="hover:bg-[#1b8057] hover:text-white p-2 flex items-center">
                  <FaShoppingCart className="mr-2 text-xl" />
                  Orders
                </Link>
              </li>
              {/* If the user is an admin, show the Admin Dashboard link */}
              {isAuthorized && user?.is_staff ? (
                <li>
                <Link to="/dashboard" className="hover:bg-[#1b8057] hover:text-white p-2 flex items-center">
                  <FaUserCircle className="mr-2 text-xl" />
                  Admin Dashboard
                </Link>
              </li>
            ) : (
                null
            )}
                
              {isAuthorized ? (
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 p-2 w-full text-left hover:bg-[#1b8057] hover:text-white flex items-center">
                    <FaSignOutAlt className="mr-2 text-xl" />
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="hover:bg-[#1b8057] hover:text-white p-2 flex items-center">
                      <FaSignOutAlt className="mr-2 text-xl" />
                      Log In
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="hover:bg-[#1b8057] hover:text-white p-2 flex items-center">
                      <FaUserPlus className="mr-2 text-xl" />
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
