import api from "../js/api.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GOOGLE_ACCESS_TOKEN } from "../js/token.js";
import google from "../assets/google.png";
import { useAuth } from "../authen/auth";

const AuthForm = ({ route, method }) => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        firstName: "",
        lastName: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (method === "login") {
                const success = await login({ 
                    username: formData.username, 
                    password: formData.password 
                });
                if (success) {
                    navigate("/", { replace: true }); // Redirect to home page
                } else {
                    setError("Login failed. Please check your credentials.");
                }
            } else {
                const res = await api.post(route, {
                    username: formData.username,
                    password: formData.password,
                    email: formData.email,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                });
                setSuccess("Registration successful. Please login.");
                setTimeout(() => navigate("/login", { replace: true }), 2000);
            }
        } catch (error) {
            console.error(error);
            if (error.response) {
                if (error.response.status === 401) {
                    setError("Invalid credentials");
                } else if (error.response.status === 400) {
                    setError("Username already exists");
                } else {
                    setError("Something went wrong. Please try again.");
                }
            } else if (error.request) {
                setError("Network error. Please check your internet connection.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "https://asswadgroceries.onrender.com/accounts/google/login/";
    };

    return (
        <div className="min-h-screen max-h-screen overflow-auto bg-gradient-to-br from-green-50 to-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-[#1b8057] py-5 px-6 text-center">
                    <h2 className="text-2xl font-bold text-white">
                        {method === "register" ? "Register" : "Login"}
                    </h2>
                    <p className="text-green-100 text-sm mt-1">
                        {method === "register" 
                            ? "Create your account to get started" 
                            : "Sign in to access your account"}
                    </p>
                </div>

                <div className="p-6">
                    {loading && (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    )}

                    {!loading && (
                        <>
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {method === "register" && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                                    First Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Last Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {method === "login" && (
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                            required
                                        />
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                        required
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="w-full py-3 bg-[#1b8057] hover:bg-[#165f3b] text-white font-medium rounded-lg transition duration-200 shadow-md"
                                    disabled={loading}
                                >
                                    {method === "register" ? "Register" : "Login"}
                                </button>

                                {method === "login" && (
                                    <div className="pt-2">
                                        <div className="relative my-6">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-300"></div>
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="px-2 bg-white text-gray-500">
                                                    Or continue with
                                                </span>
                                            </div>
                                        </div>

                                        <button 
                                            type="button" 
                                            className="w-full py-2.5 border border-gray-300 rounded-lg flex items-center justify-center space-x-3 hover:bg-gray-50 transition"
                                            onClick={handleGoogleLogin}
                                        >
                                            <img src={google} alt="Google icon" className="w-5 h-5" />
                                            <span className="text-gray-700 font-medium">Google</span>
                                        </button>
                                    </div>
                                )}
                            </form>

                            <div className="mt-6 text-center text-sm text-gray-600">
                                {method === "login" ? (
                                    <>
                                        Don't have an account?{" "}
                                        <button 
                                            onClick={() => navigate("/register")} 
                                            className="text-green-600 font-medium hover:text-green-700 hover:underline"
                                        >
                                            Register
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{" "}
                                        <button 
                                            onClick={() => navigate("/login")} 
                                            className="text-green-600 font-medium hover:text-green-700 hover:underline"
                                        >
                                            Login
                                        </button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
