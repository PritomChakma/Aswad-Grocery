import React, { useState, useEffect } from 'react';

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // You can uncomment and use your API later
        // const response = await fetch('https://your-api-url.com/admin/api/customuser/');
        // const data = await response.json();
        
        // Temporary dummy data for UI
        const data = [
          { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
          { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
        ];
        
        setUsers(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#1b8057]">User Management</h1>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-[#1b8057] text-white text-left text-sm leading-normal">
              <th className="py-3 px-6">ID</th>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Role</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6">{user._id}</td>
                <td className="py-3 px-6">{user.name}</td>
                <td className="py-3 px-6">{user.email}</td>
                <td className="py-3 px-6">{user.role}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center">
                    <button className="w-24 bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition duration-200 text-sm">
                      Edit
                    </button>
                    <button className="w-24 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-200 text-sm ml-2">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
