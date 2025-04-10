import React from 'react';

const TotalProduct = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between hover:shadow-xl transition duration-300">
      <div>
        <h2 className="text-gray-600 text-sm font-medium">Total Products</h2>
        <p className="text-3xl font-bold text-[#1b8057] mt-2">120</p> {/* You can replace 120 with your dynamic data later */}
      </div>
      <div className="bg-[#1b8057] p-3 rounded-full">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V5a2 2 0 00-2-2H6a2 2 0 00-2 2v8m16 0l-8 8-8-8" />
        </svg>
      </div>
    </div>


    
  );
};

export default TotalProduct;
