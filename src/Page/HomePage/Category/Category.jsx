import React from "react";
import BangladeshiSpice from "../../../assets/Bangladeshi-Spice.jpg";
import BangladeshiVegetable from "../../../assets/Bangladeshi-Vegitable.jpg";
import IndianSpice from "../../../assets/Indian-Spice.webp";
import Meat from "../../../assets/Meat.jpg";
import PakistaniSpice from "../../../assets/Pakistani-Spice.jpg";

const categories = [
  { name: "Meat", image: Meat },
  { name: "Pakistani Spice", image: PakistaniSpice },
  { name: "Bangladeshi Spice", image: BangladeshiSpice },
  { name: "Indian Spice", image: IndianSpice },
  { name: "Bangladeshi Vegetable", image: BangladeshiVegetable },
];

const Category = () => {
  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center bg-white rounded-xl p-4 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer group"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-gray-200 mb-3">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="text-sm md:text-base font-medium text-gray-700 group-hover:text-primary">
              {category.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
