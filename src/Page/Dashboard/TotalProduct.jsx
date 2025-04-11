import React, { useState, useEffect } from "react";
import api from "../../js/api";
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation

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
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        Loading products...
      </div>
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
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
        <Link
          to="/products/add"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:shadow-outline"
        >
          Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-600">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0].image} // Assuming the first image is the main one
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                {product.category && (
                  <p className="text-indigo-500 text-xs font-semibold mb-2">
                    {product.category.name}
                  </p>
                )}
              </div>
              <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                <Link
                  to={`/editProducts/${product.id}`}
                  className="text-blue-500 hover:text-blue-700 font-medium focus:outline-none"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleRemoveProduct(product.id)}
                  className="text-red-500 hover:text-red-700 font-medium focus:outline-none"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TotalProduct;