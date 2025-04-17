import React, { useState, useEffect } from "react";
import { FaBox, FaClipboardList, FaShoppingCart, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../js/api";

const CATEGORY_URL = "/product/categories/";
const PRODUCT_URL = "/product/products/";
const ORDER_URL = "/orders/";
const USERS_URL = "/api/users/";


const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);


  const fetchdata = async () => {
    try {
      const res = await api.get("/");
      console.log("data:", res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get(CATEGORY_URL);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get(ORDER_URL);
      console.log("Orders:", res.data); 
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };


  const fetchProducts = async () => {
    try {
      const res = await api.get(PRODUCT_URL);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get(USERS_URL);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts(); 
    fetchUsers(); 
    fetchOrders(); 
    fetchdata();
  }, []); 

  const totalCategories = categories.length; 
  const totalProducts = products.length; 
  const totalUsers = users.length; 
  const totalOrders = orders.length; 

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Dashboard Header */}
      <div className="bg-[#1b8050] text-white text-4xl font-bold py-8 shadow-md">
        <h1 className="text-center">Admin Dashboard</h1>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-10">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card Item */}
          {[
            {
              icon: <FaBox className="text-5xl text-[#1b8057]" />,
              title: "Total Products",
              count: totalProducts,
              link: "/totalProducts",
              linkText: "View Products",
            },
            {
              icon: <FaShoppingCart className="text-5xl text-[#1b8057]" />,
              title: "Total Orders",
              count: totalOrders,
              link: "/orders",
              linkText: "View Orders",
            },
            {
              icon: <FaUsers className="text-5xl text-[#1b8057]" />,
              title: "Total Users",
              count: totalUsers,
              link: "/totalusers",
              linkText: "View Users",
            },
            {
              icon: <FaClipboardList className="text-5xl text-[#1b8057]" />,
              title: "Total Categories",
              count: totalCategories, 
              link: "/categories",
              linkText: "View Categories",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col justify-between text-center group"
            >
              <div className="flex flex-col items-center">
                {item.icon}
                <h3 className="mt-4 text-xl font-semibold text-gray-700">{item.title}</h3>
                <p className="mt-2 text-3xl font-bold text-[#1b8057]">{item.count}</p>
              </div>
              <Link
                to={item.link}
                className="mt-6 text-[#1b8057] font-medium group-hover:underline"
              >
                {item.linkText}
              </Link>
            </div>
          ))}
        </div>

        {/* Action Cards */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Add New Product",
                link: "/addProduct",
                button: "Add Product",
              },
              {
                title: "Manage Orders",
                link: "/admin/orders",
                button: "Manage Orders",
              },
              {
                title: "Manage Users",
                link: "/admin/users",
                button: "Manage Users",
              },
            ].map((action, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-8 text-center flex flex-col justify-between"
              >
                <h3 className="text-xl font-semibold mb-6 text-gray-700">{action.title}</h3>
                <Link
                  to={action.link}
                  className="inline-block bg-[#1b8057] hover:bg-[#155d43] text-white py-3 px-6 rounded-full transition"
                >
                  {action.button}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
