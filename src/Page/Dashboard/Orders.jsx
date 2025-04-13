// src/components/Admin/OrderManagement.js
import React, { useState, useEffect, useCallback } from "react";
import api from "../../js/api.js"; 
import { format } from 'date-fns'; 

const API_URL = "/orders/"; 

const ORDER_STATUS_CHOICES = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState({});

    // Fetch orders from the API
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(API_URL);
            // Sort orders by creation date, newest first
            const sortedOrders = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setOrders(sortedOrders);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Failed to load orders. Please ensure you are logged in as an administrator.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Handle status change for an order
    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
        setError(null); // Clear previous errors
        try {
            await api.patch(`${API_URL}${orderId}/`, { status: newStatus });

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (err) {
            console.error("Error updating order status:", err.response?.data || err);
            setError(`Failed to update status for order ${orderId}.`);
        } finally {
             setUpdatingStatus(prev => ({ ...prev, [orderId]: false })); // Clear loading state
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'processing': return 'text-blue-600 bg-blue-100';
            case 'completed': return 'text-green-600 bg-green-100';
            case 'cancelled': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    // --- UI Rendering ---

    if (loading) {
        return <div className="text-center p-10">Loading orders...</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Order Management</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            {orders.length === 0 && !loading && (
                <p className="text-center text-gray-500">No orders found.</p>
            )}

            <div className="space-y-6">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white shadow-lg hover:shadow-xl rounded-lg p-5 transition duration-300 ease-in-out transform hover:-translate-y-1"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                            <div className="mb-3 md:mb-0">
                                <h2 className="text-xl font-semibold text-gray-800">Order #{order.id}</h2>
                                <p className="text-sm text-gray-500">
                                    Placed on: {format(new Date(order.created_at), 'PPpp')} {/* Format date */}
                                </p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {ORDER_STATUS_CHOICES.find(s => s.value === order.status)?.label || order.status}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-700">
                            <div>
                                <strong className="block text-gray-600">User:</strong>
                                {/* Adjust based on your user serializer */}
                                {order.user?.username || order.user?.email || `User ID: ${order.user}`}
                            </div>
                            <div>
                                <strong className="block text-gray-600">Total Amount:</strong>
                                {/* Format currency as needed */}
                                ${parseFloat(order.total_amount).toFixed(2)}
                            </div>
                             <div>
                                <strong className="block text-gray-600">Contact:</strong>
                                {order.contact_number}
                            </div>
                            <div className="md:col-span-3">
                                <strong className="block text-gray-600">Shipping Address:</strong>
                                <p className="whitespace-pre-wrap">{order.shipping_address}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-3 mt-4 border-t pt-4">
                            <label htmlFor={`status-${order.id}`} className="text-sm font-medium text-gray-600">
                                Update Status:
                            </label>
                            <select
                                id={`status-${order.id}`}
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                disabled={updatingStatus[order.id]} // Disable while updating this specific order
                                className={`border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out ${updatingStatus[order.id] ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}`}
                            >
                                {ORDER_STATUS_CHOICES.map((statusOption) => (
                                    <option key={statusOption.value} value={statusOption.value}>
                                        {statusOption.label}
                                    </option>
                                ))}
                            </select>
                             {updatingStatus[order.id] && (
                                 <span className="text-xs text-blue-500">Updating...</span>
                             )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderManagement;