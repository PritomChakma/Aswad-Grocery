import React from 'react';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../authen/auth";
import {Link} from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const {isAuthorized, logout} = useAuth();


    const handleLogout = () => {
        logout();
        navigate('/');
    };


  return (
    <div className="navbar bg-[#1b8057] shadow-md sticky top-0 z-50 px-4">
      {/* Logo */}
      <div className="flex-1">
        <a className="text-3xl font-bold text-white hover:text-gray-200 transition-colors duration-300">
          Aswad Grocery
        </a>
      </div>

      {/* Menu for large screens */}
      <div className="hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-white font-semibold gap-2">
          <li><a className="hover:text-gray-200">Home</a></li>
          <li><a className="hover:text-gray-200">Shop</a></li>
          <li><a className="hover:text-gray-200">Deals</a></li>
          <li><a className="hover:text-gray-200">About Us</a></li>
          <li><a className="hover:text-gray-200">Contact</a></li>
        </ul>
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-4">
        {/* Search bar */}
        <div className="hidden md:block">
          <input
            type="text"
            placeholder="Search groceries..."
            className="input input-bordered w-36 md:w-64 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* Cart Icon */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <FaShoppingCart className="text-2xl text-white " />
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

        {/* User Icon */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <FaUserCircle className="text-3xl text-white" />
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li><a className="hover:bg-[#1b8057] hover:text-white">Profile</a></li>
            <li><a className="hover:bg-[#1b8057] hover:text-white">Orders</a></li>
            <li><a className="hover:bg-[#1b8057] hover:text-white">Settings</a></li>
            {isAuthorized ? (
                    <>
                        <li>
                            <button onClick={handleLogout} className="button-link">Logout</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/login" className="button-link-login">Log In</Link>
                        </li>
                        <li>
                            <Link to="/register" className="button-link">Register</Link>
                        </li>
                    </>
                )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
