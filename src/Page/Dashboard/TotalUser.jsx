import React, { useState, useEffect, useCallback } from "react";
import api from "../../js/api"; // Assuming your API setup is here
import { format } from 'date-fns'; // For formatting dates (optional, install: npm install date-fns)

// Define the API endpoint for users
const API_URL = "/api/users/"; // Adjust if your URL differs

const TotalUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch users from the API
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(API_URL);
            // Sort users alphabetically by username
            const sortedUsers = res.data.sort((a, b) =>
                a.username.localeCompare(b.username)
            );
            setUsers(sortedUsers);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load users. Please ensure you are logged in with administrator privileges.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Helper function to format names
    const formatFullName = (user) => {
        const firstName = user.first_name || '';
        const lastName = user.last_name || '';
        if (firstName && lastName) {
            return `${firstName} ${lastName}`;
        }
        return firstName || lastName || 'N/A'; // Return single name if only one exists, else N/A
    }

    // --- UI Rendering ---

    if (loading) {
        return <div className="text-center p-10">Loading users...</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">User Management</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            {users.length === 0 && !loading && (
                <p className="text-center text-gray-500">No users found.</p>
            )}

            <div className="space-y-4">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="bg-white shadow-lg hover:shadow-xl rounded-lg p-5 transition duration-300 ease-in-out transform hover:-translate-y-1"
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                            {/* User Info */}
                            <div className="mb-2 sm:mb-0">
                                <h2 className="text-xl font-semibold text-gray-800">{user.username}</h2>
                                <p className="text-sm text-blue-600">{user.email}</p>
                                <p className="text-sm text-gray-600">Full Name: {formatFullName(user)}</p>
                            </div>
                            {/* Status Badge */}
                            <div>
                                {/* {user.is_superuser && ( 
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                        Superuser
                                    </span>
                                )} */}
                                {user.is_staff && (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 mr-2">
                                        Staff
                                    </span>
                                )}
                                {!user.is_staff && (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 mr-2">
                                        Customer
                                    </span>
                                )}
                                 
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="text-xs text-gray-500 border-t pt-3 mt-3">
                            Joined: {user.date_joined ? format(new Date(user.date_joined), 'PPp') : 'N/A'}
                             <span className="mx-2">|</span> User ID: {user.id}
                        </div>

                        {/* Add Action Buttons here if needed in the future */}
                        {/* <div className="flex justify-end space-x-2 mt-4">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">View Details</button>
                            <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm">Edit</button>
                        </div> */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TotalUsers;
