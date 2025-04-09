import React from 'react';
import banner from "../../assets/BannerImg.jpeg"; 

const Banner = () => {
  return (
    <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] bg-cover bg-center" style={{ backgroundImage: `url(${banner})` }}>
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="flex items-center justify-center absolute inset-0 text-center text-white px-4 sm:px-8">
        <div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4">
            Fresh Groceries Delivered to Your Doorstep
          </h1>
          <p className="text-sm sm:text-lg md:text-xl mb-6 max-w-lg mx-auto">
            Opening soon in Winnipeg! Date to be announced. Stay tuned for grand opening promotions coming soon.
          </p>
          <button className="bg-[#1b8057] text-white px-6 py-3 rounded-lg text-lg hover:bg-[#165f3b] transition duration-300">
            Stay Updated
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
