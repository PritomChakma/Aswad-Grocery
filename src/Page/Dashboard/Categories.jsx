import React, { useState, useEffect, useRef  } from "react";
import api from "../../js/api";

const API_URL = "/product/categories/";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "", slug: "", image: null });
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef();
  const fetchCategories = async () => {
    try {
      const res = await api.get(API_URL);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else if (name === "name") {
      const slugified = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData({ ...formData, name: value, slug: slugified });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", formData.name);
    form.append("slug", formData.slug);
    if (formData.image) form.append("image", formData.image);

    try {
      if (editingId) {
        await api.put(`${API_URL}${editingId}/`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setEditingId(null);
      } else {
        await api.post(API_URL, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setFormData({ name: "", slug: "", image: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err.response?.data || err);
    }
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name, slug: category.slug || "", image: null });
    setEditingId(category.id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`${API_URL}${id}/`);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Manage Categories</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8 space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={formData.name}
          onChange={handleChange}
          className="border border-gray-300 w-full p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="slug"
          placeholder="Slug"
          value={formData.slug}
          readOnly
          className="border border-gray-300 w-full p-3 rounded bg-gray-100 cursor-not-allowed"
        />
        <input
          type="file"
          name="image"
          onChange={handleChange}
          ref={fileInputRef}
          className="w-full text-gray-600"
          accept="image/*"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold w-full py-3 rounded"
        >
          {editingId ? "Update Category" : "Add Category"}
        </button>
      </form>

      <ul className="space-y-4">
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex items-center justify-between bg-white shadow-sm hover:shadow-md p-4 rounded-lg transition"
          >
            <div className="flex items-center gap-4">
              {category.image && (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-14 h-14 object-cover rounded-full border"
                />
              )}
              <div>
                <span className="text-lg font-medium text-gray-700 block">{category.name}</span>
                <span className="text-sm text-gray-500">{category.slug}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(category)}
                className="bg-yellow-400 hover:bg-yellow-500 transition text-white px-4 py-2 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
