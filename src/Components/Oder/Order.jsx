import React, { useState } from 'react';

const Order = () => {
  const [orderSummary] = useState({
    items: [
      { name: 'Chicken', quantity: 2, price: 5.99 },
      { name: 'Beef', quantity: 1, price: 9.99 },
      { name: 'Mutton', quantity: 3, price: 12.99 },
    ],
    shippingFee: 4.99,
    tax: 2.50,
  });

  const totalAmount = orderSummary.items.reduce((acc, item) => acc + item.price * item.quantity, 0) + orderSummary.shippingFee + orderSummary.tax;

  return (
    <div className="bg-gradient-to-br from-[#f3f4f6] to-[#e2e8f0] min-h-screen py-16 px-8">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-xl">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">Complete Your Order</h2>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-4">
            {orderSummary.items.map((item, index) => (
              <div key={index} className="flex justify-between text-lg font-medium text-gray-700">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between text-lg font-semibold mt-4">
              <span>Shipping Fee</span>
              <span>${orderSummary.shippingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Tax</span>
              <span>${orderSummary.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-semibold text-[#1b8057] mt-4">
              <span>Total Amount</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Billing Information */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Billing & Shipping Information</h3>
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b8057] transition duration-300"
            />
            <input
              type="text"
              placeholder="Address"
              className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b8057] transition duration-300"
            />
            <input
              type="text"
              placeholder="City"
              className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b8057] transition duration-300"
            />
            <input
              type="text"
              placeholder="Zip Code"
              className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b8057] transition duration-300"
            />
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Payment Information</h3>
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Card Number"
              className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b8057] transition duration-300"
            />
            <input
              type="text"
              placeholder="Expiry Date (MM/YY)"
              className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b8057] transition duration-300"
            />
            <input
              type="text"
              placeholder="CVV"
              className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b8057] transition duration-300"
            />
          </div>
        </div>

        {/* Order Action Buttons */}
        <div className="flex justify-between items-center">
          <button className="w-full md:w-auto py-3 px-8 bg-[#1b8057] text-white font-semibold text-lg rounded-lg hover:bg-[#155d43] transition duration-300">
            Place Order
          </button>
          <button className="w-full md:w-auto py-3 px-8 bg-gray-200 text-[#1b8057] font-semibold text-lg rounded-lg hover:bg-gray-300 transition duration-300">
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
