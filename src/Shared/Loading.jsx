import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>

        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#1b8057] border-t-transparent rounded-full animate-spin"></div>

        <div className="absolute inset-2 bg-white rounded-full"></div>
      </div>
    </div>
  );
};

export default Loading;
