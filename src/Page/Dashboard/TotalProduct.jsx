import React, { useState, useEffect } from "react";
import api from "../../js/api";
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation
import Loading from "../../Shared/Loading";

const TotalProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for programmatic navigation

  const fetchProducts = async () => {
    try {
      const response = await api.get("/product/products/");
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/product/products/${productId}/`);
        fetchProducts();
      } catch (err) {
        console.error(`Error deleting product with ID ${productId}:`, err);
        alert("Failed to delete product.");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
    <Loading></Loading>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-red-500">
        {error}
      </div>
    );
  }

  return (
<div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
  {/* Header */}
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
    <div>
      <h1 className="text-4xl font-bold text-gray-900">Product Catalog</h1>
      <p className="mt-2 text-lg text-gray-600">Manage, edit or add your products easily.</p>
    </div>
    <Link
      to="/addProduct"
      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-base font-semibold bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg transition-all duration-300"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
      Add Product
    </Link>
  </div>

  {/* No Products Message */}
  {products.length === 0 ? (
    <div className="bg-white rounded-2xl shadow-md p-16 text-center border border-dashed border-gray-200">
      <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0v10l-8 4v-10m0-4L4 7v10l8 4" />
      </svg>
      <h3 className="mt-6 text-xl font-semibold text-gray-800">No Products Available</h3>
      <p className="mt-2 text-gray-500">Start adding your products to display them here.</p>
      <div className="mt-6">
        <Link
          to="/addProduct"
          className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition duration-300"
        >
          Add Product
        </Link>
      </div>
    </div>
  ) : (
    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300"
        >
          {/* Product Image */}
          <img
            src={product.images?.[0]?.image || "https://via.placeholder.com/300x200"}
            alt={product.name}
            className="w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover" 
          />

          {/* Product Info */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
            <p className="text-xl font-bold text-emerald-600 mt-4">${product.price ?? '--'}</p>

            {/* Buttons */}
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <Link
                to={`/editProducts/${product.id}`}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Link>

              <button
                onClick={() => handleRemoveProduct(product.id)}
                className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-200 flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  
  );
};

export default TotalProduct;