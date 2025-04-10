import React from 'react';
import { FaShoppingCart, FaShoppingBag } from 'react-icons/fa';  // Importing the icons
import chicken from "../../assets/Meat/Chicken.jpg";
import Beef from "../../assets/Meat/beef.webp";
import Mutton from "../../assets/Meat/Mutton.webp";
import Duck from "../../assets/Meat/Duck.webp";

const Meat = () => {
  const meats = [
    {
      name: "Chicken",
      image: chicken,
      description: "Fresh and tender chicken, perfect for any dish.",
      price: "$5.99"
    },
    {
      name: "Beef",
      image: Beef,
      description: "High-quality beef for your everyday meals.",
      price: "$9.99"
    },
    {
      name: "Mutton",
      image: Mutton,
      description: "Delicious mutton cuts for rich, flavorful recipes.",
      price: "$12.99"
    },
    {
      name: "Duck",
      image: Duck,
      description: "Savory duck meat, ideal for gourmet dishes.",
      price: "$14.99"
    },
  ];

  return (
    <div className="p-6">
      {/* Heading and Paragraph */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800">Our Premium Meat Selection</h2>
        <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
          Explore our premium selection of fresh, high-quality meats, from tender chicken to flavorful mutton. Perfect for any meal, elevate your dining experience with our carefully curated choices.
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {meats.map((meat, index) => (
          <div 
            key={index} 
            className="max-w-xs mx-auto rounded-lg overflow-hidden shadow-lg bg-white transform transition duration-300 hover:scale-105"
          >
            <img 
              src={meat.image} 
              alt={meat.name} 
              className="w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover" 
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{meat.name}</h3>
              <p className="text-gray-600 mb-3">{meat.description}</p>
              <p className="text-lg font-bold text-[#1b8057] mb-4">{meat.price}</p>

              {/* Button Section */}
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                {/* Shop Now Button */}
                <button className="w-full sm:w-auto py-2 px-3 bg-[#1b8057] text-white rounded-lg hover:bg-[#166644] transition duration-300 flex items-center justify-center text-xs">
                  <FaShoppingBag className="mr-2" />
                  Shop Now
                </button>

                {/* Add to Cart Button */}
                <button className="w-full sm:w-auto py-2 px-3 bg-gray-200 text-[#1b8057] rounded-lg hover:bg-gray-300 transition duration-300 flex items-center justify-center text-xs">
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Meat;
