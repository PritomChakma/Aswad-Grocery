// src/components/Customer/OrderPage.js
import React, { useState, useEffect } from "react";
import { format } from 'date-fns'; 
import Loading from "../../Shared/Loading.jsx";

const ORDER_STATUS_CHOICES = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);

    // Static data for visualization
    const staticOrders = [
        {
            id: 1,
            created_at: "2025-04-15T12:00:00Z",
            status: 'completed',
            user: { username: "JohnDoe", email: "john.doe@example.com" },
            total_amount: 120.50,
            contact_number: "+123456789",
            shipping_address: "123 Main St, Springfield, USA",
            payment_method: "Credit Card (•••• •••• •••• 4242)",
            tracking_number: "UPS-1Z999AA0392755436",
            estimated_delivery: "2025-04-18T00:00:00Z",
            products: [
                { name: "Premium Cotton T-Shirt", price: 40.00, quantity: 2, image: "https://via.placeholder.com/80" },
                { name: "Ceramic Coffee Mug", price: 20.00, quantity: 1, image: "https://via.placeholder.com/80" },
            ]
        },
        {
            id: 2,
            created_at: "2025-04-12T14:30:00Z",
            status: 'pending',
            user: { username: "JaneSmith", email: "jane.smith@example.com" },
            total_amount: 90.00,
            contact_number: "+987654321",
            shipping_address: "456 Elm St, Rivertown, USA",
            payment_method: "PayPal (jane.smith@example.com)",
            tracking_number: null,
            estimated_delivery: "2025-04-20T00:00:00Z",
            products: [
                { name: "Baseball Cap", price: 15.00, quantity: 2, image: "https://via.placeholder.com/80" },
                { name: "Leather Backpack", price: 60.00, quantity: 1, image: "https://via.placeholder.com/80" },
            ]
        }
    ];

    useEffect(() => {
        setLoading(true);
        // Simulate fetching data from the backend
        setTimeout(() => {
            setOrders(staticOrders);
            setLoading(false);
        }, 1000);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'processing': return 'text-blue-600 bg-blue-100';
            case 'completed': return 'text-green-600 bg-green-100';
            case 'cancelled': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                <p className="text-gray-500 mt-2">View and manage your order history</p>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded" role="alert">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {orders.length === 0 && !loading && (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Your order history will appear here once you make a purchase.</p>
                    <div className="mt-6">
                        <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Start Shopping
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                        <div className="px-4 py-5 sm:px-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Order #{order.id}
                                    </h3>
                                    <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {ORDER_STATUS_CHOICES.find(s => s.value === order.status)?.label || order.status}
                                    </span>
                                </div>
                                <div className="mt-2 sm:mt-0 text-sm text-gray-500">
                                    Placed on {format(new Date(order.created_at), 'MMMM d, yyyy')}
                                </div>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            <dl className="sm:divide-y sm:divide-gray-200">
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Total amount
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">
                                        ${parseFloat(order.total_amount).toFixed(2)}
                                    </dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Payment method
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {order.payment_method}
                                    </dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Estimated delivery
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {format(new Date(order.estimated_delivery), 'MMMM d, yyyy')}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                        
                        <div className="px-4 py-4 bg-gray-50 sm:px-6">
                            <button
                                type="button"
                                onClick={() => toggleOrderExpansion(order.id)}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                            >
                                {expandedOrder === order.id ? 'Hide details' : 'View details'}
                            </button>
                        </div>
                        
                        {expandedOrder === order.id && (
                            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                <div className="px-4 py-5 sm:px-6">
                                    <h4 className="text-md font-medium text-gray-900">Order Details</h4>
                                </div>
                                
                                <div className="px-4 py-5 sm:p-0">
                                    <dl className="sm:divide-y sm:divide-gray-200">
                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Shipping address
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {order.shipping_address}
                                            </dd>
                                        </div>
                                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Contact information
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {order.contact_number}
                                                <div className="mt-1">{order.user?.email}</div>
                                            </dd>
                                        </div>
                                        {order.tracking_number && (
                                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Tracking number
                                                </dt>
                                                <dd className="mt-1 text-sm text-indigo-600 sm:mt-0 sm:col-span-2">
                                                    <a href="#" className="hover:underline">{order.tracking_number}</a>
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                                
                                <div className="px-4 py-5 sm:px-6">
                                    <h4 className="text-md font-medium text-gray-900">Items</h4>
                                </div>
                                
                                <div className="px-4 py-5 sm:p-0">
                                    {order.products.map((product, index) => (
                                        <div key={index} className="py-4 sm:py-5 sm:grid sm:grid-cols-5 sm:gap-4 sm:px-6 border-t border-gray-200">
                                            <div className="col-span-1">
                                                <img src={product.image} alt={product.name} className="h-20 w-20 rounded-md object-cover" />
                                            </div>
                                            <div className="col-span-3">
                                                <h5 className="text-sm font-medium text-gray-900">{product.name}</h5>
                                                <p className="mt-1 text-sm text-gray-500">Quantity: {product.quantity}</p>
                                            </div>
                                            <div className="col-span-1 text-right">
                                                <p className="text-sm font-medium text-gray-900">${parseFloat(product.price).toFixed(2)}</p>
                                                <p className="mt-1 text-sm text-gray-500">${parseFloat(product.price * product.quantity).toFixed(2)} total</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="px-4 py-4 bg-gray-50 sm:px-6 flex justify-end">
                                    {order.status === 'completed' && (
                                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3">
                                            Buy it again
                                        </button>
                                    )}
                                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Contact Support
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderPage;