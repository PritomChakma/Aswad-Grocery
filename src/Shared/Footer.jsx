import React from 'react';

const Footer = () => {
  return (
    <div className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        {/* Footer Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">About FreshMart</h2>
            <p className="text-sm mb-4">Your one-stop shop for fresh groceries delivered to your door. We provide the best quality and service to ensure you always get the best produce.</p>
            <a href="#" className="hover:text-gray-200 text-sm">Learn More</a>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
            <ul>
              <li><a href="#" className="hover:text-gray-200 text-sm">Home</a></li>
              <li><a href="#" className="hover:text-gray-200 text-sm">Shop</a></li>
              <li><a href="#" className="hover:text-gray-200 text-sm">Deals</a></li>
              <li><a href="#" className="hover:text-gray-200 text-sm">About Us</a></li>
              <li><a href="#" className="hover:text-gray-200 text-sm">Contact</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <ul>
              <li className="text-sm mb-2"><i className="fas fa-phone-alt"></i> +1 (123) 456-7890</li>
              <li className="text-sm mb-2"><i className="fas fa-envelope"></i> support@freshmart.com</li>
              <li className="text-sm mb-2"><i className="fas fa-map-marker-alt"></i> 123 FreshMart St, City, Country</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-sm mb-4">Stay updated on the latest offers and new arrivals.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered text-sm w-full rounded-l-lg"
              />
              <button className="btn bg-[#1b8057] text-white text-sm rounded-r-lg hover:bg-[#165c42]">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-gray-700 pt-6 text-center">
          <p className="text-sm">
            FreshMart &copy; 2025 | All Rights Reserved.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="#" className="text-xl hover:text-gray-200"><i className="fab fa-facebook"></i></a>
            <a href="#" className="text-xl hover:text-gray-200"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-xl hover:text-gray-200"><i className="fab fa-instagram"></i></a>
            <a href="#" className="text-xl hover:text-gray-200"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
