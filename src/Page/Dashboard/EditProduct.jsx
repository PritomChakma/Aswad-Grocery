// src/components/EditProduct.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../js/api";

// Define API endpoint constants based on Django urls.py
const PRODUCT_URL = "/product/products/";
const IMAGE_URL = "/product/images/";
const ATTRIBUTE_URL = "/product/attributes/";
const CATEGORY_URL = "/product/categories/";

// --- Helper Function to Generate Slugs ---
const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  // --- State Variables ---
  const [productData, setProductData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "",
    stock_quantity: 0,
    is_active: true,
    is_featured: false,
  });

  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState({
    file: null,
    alt_text: "",
    is_main: false,
  });

  const [attributes, setAttributes] = useState([]);
  const [currentAttribute, setCurrentAttribute] = useState({
    name: "",
    value: "",
    price: "",
  });

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // --- Fetch Initial Data (Product Details and Categories) ---
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [productRes, categoriesRes] = await Promise.all([
          api.get(`${PRODUCT_URL}${productId}/`),
          api.get(CATEGORY_URL),
        ]);

        const product = productRes.data;
        setProductData({
          name: product.name,
          slug: product.slug,
          description: product.description,
          category: product.category ? product.category.id : "",
          stock_quantity: product.stock_quantity,
          is_active: product.is_active,
          is_featured: product.is_featured,
        });

        setImages(product.images.map(img => ({ ...img, file: null, id: img.id }))); // Keep existing image data
        setAttributes(product.attributes.map(attr => ({ ...attr, id: attr.id.toString() }))); // Ensure ID is string for consistency
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error("Error fetching product or categories:", err);
        setError("Failed to load product details or categories.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchInitialData();
    } else {
      setError("No product ID provided.");
      setLoading(false);
    }
  }, [productId]);

  // --- Handlers for Product Details ---
  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newProductData = {
      ...productData,
      [name]: type === "checkbox" ? checked : value,
    };
    if (name === "name") {
      newProductData.slug = slugify(value);
    }
    setProductData(newProductData);
  };

  // --- Handlers for Images ---
  const handleCurrentImageChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setCurrentImage({ ...currentImage, file: files[0] });
    } else {
      setCurrentImage({
        ...currentImage,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const addImage = () => {
    if (!currentImage.file || !currentImage.alt_text) {
      alert("Please provide an image file and its alt text.");
      return;
    }
    const newImage = { ...currentImage, id: Date.now() };
    let updatedImages = [...images];
    if (newImage.is_main) {
      updatedImages = updatedImages.map(img => ({ ...img, is_main: false }));
    }
    setImages([...updatedImages, newImage]);
    setCurrentImage({ file: null, alt_text: "", is_main: false });
    const fileInput = document.getElementById('image-file-input');
    if (fileInput) fileInput.value = "";
  };

  const removeImage = async (idToRemove) => {
    if (typeof idToRemove === 'number') { // If it's an existing image from the backend
      if (window.confirm("Are you sure you want to delete this image?")) {
        try {
          await api.delete(`${IMAGE_URL}${idToRemove}/`);
          setImages(images.filter((img) => img.id !== idToRemove));
        } catch (err) {
          console.error("Error deleting image:", err);
          setError("Failed to delete image.");
        }
      }
    } else { // If it's a newly added image not yet on the backend
      setImages(images.filter((img) => img.id !== idToRemove));
    }
  };

  const toggleMainImage = (idToToggle) => {
    setImages(images.map(img => ({
      ...img,
      is_main: img.id === idToToggle
    })));
  };

  // --- Handlers for Attributes ---
  const handleCurrentAttributeChange = (e) => {
    const { name, value } = e.target;
    setCurrentAttribute({ ...currentAttribute, [name]: value });
  };

  const addAttribute = () => {
    if (!currentAttribute.name || !currentAttribute.value || currentAttribute.price === "") {
      alert("Please fill in all attribute fields (Name, Value, Price).");
      return;
    }
    setAttributes([...attributes, { ...currentAttribute, id: Date.now().toString() }]);
    setCurrentAttribute({ name: "", value: "", price: "" });
  };

  const removeAttribute = async (idToRemove) => {
    if (typeof parseInt(idToRemove) === 'number') { // If it's an existing attribute from the backend
      if (window.confirm("Are you sure you want to delete this attribute?")) {
        try {
          await api.delete(`${ATTRIBUTE_URL}${idToRemove}/`);
          setAttributes(attributes.filter((attr) => attr.id !== idToRemove));
        } catch (err) {
          console.error("Error deleting attribute:", err);
          setError("Failed to delete attribute.");
        }
      }
    } else { // If it's a newly added attribute
      setAttributes(attributes.filter((attr) => attr.id !== idToRemove));
    }
  };

  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!productData.name || !productData.category || productData.stock_quantity < 0) {
      setError("Please fill in all required product fields (Name, Category, Stock >= 0).");
      setLoading(false);
      return;
    }
    if (!images.some(img => img.is_main)) {
      setError("Please mark one image as the main image.");
      setLoading(false);
      return;
    }

    try {
      // --- Step 1: Update the Product ---
      const productPayload = {
        ...productData,
        category: parseInt(productData.category, 10),
        stock_quantity: parseInt(productData.stock_quantity, 10),
      };
      console.log("Updating Product Data:", productPayload);
      await api.put(`${PRODUCT_URL}${productId}/`, productPayload);
      console.log("Product Updated Successfully, ID:", productId);
      setSuccess(`Product "${productData.name}" (ID: ${productId}) updated successfully!`);

      // --- Step 2: Handle New/Updated Images ---
      const newImages = images.filter(img => !img.id || typeof img.id === 'string');
      const imagePromises = newImages.map((img, index) => {
        const formData = new FormData();
        formData.append("product", productId);
        formData.append("image", img.file);
        formData.append("alt_text", img.alt_text);
        formData.append("is_main", img.is_main);
        formData.append('position', index);
        return api.post(IMAGE_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      });
      await Promise.all(imagePromises);
      console.log("New Images Submitted Successfully");

      // --- Step 3: Handle New Attributes ---
      const newAttributes = attributes.filter(attr => !attr.id || typeof attr.id === 'string');
      const attributePromises = newAttributes.map(attr => {
        const attributePayload = {
          product: productId,
          name: attr.name,
          value: attr.value,
          price: parseFloat(attr.price).toFixed(2),
        };
        return api.post(ATTRIBUTE_URL, attributePayload);
      });
      await Promise.all(attributePromises);
      console.log("New Attributes Submitted Successfully");

      // Optionally navigate back to the product list
      setTimeout(() => navigate("/products"), 1500);

    } catch (err) {
      console.error("Error during product update process:", err.response?.data || err.message || err);
      let errorMessage = "Failed to update product.";
      if (err.response?.data) {
        errorMessage = Object.entries(err.response.data)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join(' | ');
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-xl my-8 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 border-b pb-4">
        Edit Product
      </h1>

      {loading && <div className="text-center text-blue-600 p-3">Loading product details...</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">{success}</div>}

      {!loading && productData && (
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* === Product Details Section === */}
          <fieldset className="border p-5 rounded-lg shadow-sm bg-white transition-shadow hover:shadow-md">
            <legend className="text-xl font-semibold px-2 text-gray-900 mb-4">Product Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">Name <span className="text-red-500">*</span></label>
                <input type="text" id="name" name="name" value={productData.name} onChange={handleProductChange} className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" required />
              </div>
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-900 mb-1">Slug (auto-generated)</label>
                <input type="text" id="slug" name="slug" value={productData.slug} readOnly className="w-full border border-gray-300 p-2 rounded-md bg-gray-100 focus:outline-none focus:ring-0 text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-900 mb-1">Stock Quantity <span className="text-red-500">*</span></label>
                <input type="number" id="stock_quantity" name="stock_quantity" min="0" value={productData.stock_quantity} onChange={handleProductChange} className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" required />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-1">Category <span className="text-red-500">*</span></label>
                <select id="category" name="category" value={productData.category} onChange={handleProductChange} className="w-full border border-gray-300 p-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" required>
                  <option value="">-- Select Category --</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-1">Description</label>
                <textarea id="description" name="description" value={productData.description} onChange={handleProductChange} rows="4" className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" placeholder="Enter a detailed description of the product..."></textarea>
              </div>
              <div className="md:col-span-2 flex items-center gap-6 pt-2">
                <label htmlFor="is_active" className="flex items-center gap-2 text-sm font-medium text-gray-900 cursor-pointer">
                  <input type="checkbox" id="is_active" name="is_active" checked={productData.is_active} onChange={handleProductChange} className="rounded h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" /> Active
                </label>
                <label htmlFor="is_featured" className="flex items-center gap-2 text-sm font-medium text-gray-900 cursor-pointer">
                  <input type="checkbox" id="is_featured" name="is_featured" checked={productData.is_featured} onChange={handleProductChange} className="rounded h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" /> Featured
                </label>
              </div>
            </div>
          </fieldset>

          {/* === Image Upload Section === */}
          <fieldset className="border p-5 rounded-lg shadow-sm bg-white transition-shadow hover:shadow-md">
            <legend className="text-xl font-semibold px-2 text-gray-900 mb-4">Product Images <span className="text-red-500">*</span></legend>
            <div className="flex flex-col sm:flex-row gap-4 items-end mb-6 p-4 border rounded-md bg-gray-50">
              <div className="flex-grow w-full sm:w-auto">
                <label htmlFor="image-file-input" className="block text-sm font-medium text-gray-900 mb-1">Image File <span className="text-red-500">*</span></label>
                <input type="file" id="image-file-input" name="file" onChange={handleCurrentImageChange} accept="image/png, image/jpeg, image/gif, image/webp" className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div className="flex-grow w-full sm:w-auto">
                <label htmlFor="alt_text" className="block text-sm font-medium text-gray-900 mb-1">Alt Text <span className="text-red-500">*</span></label>
                <input type="text" name="alt_text" placeholder="Describe the image" value={currentImage.alt_text} onChange={handleCurrentImageChange} className="w-full border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" />
              </div>
              <div className="flex items-center pt-5 whitespace-nowrap">
                <input type="checkbox" name="is_main" id="is_main_current" checked={currentImage.is_main} onChange={handleCurrentImageChange} className="rounded mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                <label htmlFor="is_main_current" className="text-sm font-medium text-gray-900 cursor-pointer">Set as Main?</label>
              </div>
              <button type="button" onClick={addImage} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition duration-150 ease-in-out shadow-sm hover:shadow whitespace-nowrap w-full sm:w-auto">
                Add Image
              </button>
            </div>

            {images.length > 0 && (
              <div className="space-y-3 mt-4">
                <h4 className="text-md font-semibold text-gray-600 mb-2 border-t pt-4">Added Images (Mark one as main):</h4>
                {images.map((img, index) => (
                  <div key={img.id} className="flex items-center justify-between gap-3 p-3 border rounded-md bg-gray-50 hover:bg-gray-100 text-sm transition duration-150 ease-in-out">
                    <div className="flex items-center gap-3 overflow-hidden flex-grow">
                      {img.url ? <img src={img.url} alt={img.alt_text} className="w-12 h-12 object-cover rounded-md border" /> : (img.file && <img src={URL.createObjectURL(img.file)} alt="Preview" className="w-12 h-12 object-cover rounded-md border" />)}
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-medium text-gray-800 truncate flex-shrink min-w-0">{img.file?.name || img.alt_text}</span>
                        <span className="text-gray-600 truncate flex-shrink min-w-0">Alt: {img.alt_text}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <label htmlFor={`main-${img.id}`} className={`flex items-center gap-1 cursor-pointer px-2 py-1 rounded ${img.is_main ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-200'}`}>
                        <input type="radio" id={`main-${img.id}`} name="main_image_selector" checked={img.is_main} onChange={() => toggleMainImage(img.id)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                        Main
                      </label>
                      <button type="button" onClick={() => removeImage(img.id)} className="text-red-600 hover:text-red-800 font-semibold text-xs uppercase tracking-wide">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </fieldset>

          {/* === Attributes/Variants Section === */}
          <fieldset className="border p-5 rounded-lg shadow-sm bg-white transition-shadow hover:shadow-md">
            <legend className="text-xl font-semibold px-2 text-gray-900 mb-4">Product Variants/Attributes</legend>
            <div className="flex flex-col sm:flex-row gap-4 items-end mb-6 p-4 border rounded-md bg-gray-50">
              <div className="flex-grow w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-900 mb-1">Attribute Name <span className="text-red-500">*</span></label>
                <input type="text" name="name" placeholder="e.g., Size, Color" value={currentAttribute.name} onChange={handleCurrentAttributeChange} className="w-full border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" />
              </div>
              <div className="flex-grow w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-900 mb-1">Attribute Value <span className="text-red-500">*</span></label>
                <input type="text" name="value" placeholder="e.g., Large, Red" value={currentAttribute.value} onChange={handleCurrentAttributeChange} className="w-full border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" />
              </div>
              <div className="flex-grow w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-900 mb-1">Price <span className="text-red-500">*</span></label>
                <input type="number" name="price" placeholder="e.g., 99.99" step="0.01" min="0" value={currentAttribute.price} onChange={handleCurrentAttributeChange} className="w-full border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" />
              </div>
              <button type="button" onClick={addAttribute} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition duration-150 ease-in-out shadow-sm hover:shadow whitespace-nowrap w-full sm:w-auto">
                Add Attribute
              </button>
            </div>

            {attributes.length > 0 && (
              <div className="space-y-3 mt-4">
                <h4 className="text-md font-semibold text-gray-600 mb-2 border-t pt-4">Added Attributes:</h4>
                {attributes.map((attr) => (
                  <div key={attr.id} className="flex items-center justify-between gap-3 p-3 border rounded-md bg-gray-50 hover:bg-gray-100 text-sm transition duration-150 ease-in-out">
                    <span className="font-medium text-gray-800">{attr.name}: {attr.value}</span>
                    <span className="text-gray-600">(${parseFloat(attr.price || 0).toFixed(2)})</span>
                    <button type="button" onClick={() => removeAttribute(attr.id)} className="text-red-600 hover:text-red-800 font-semibold text-xs uppercase tracking-wide ml-auto pl-4">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </fieldset>

          {/* === Submit Button === */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 transition duration-150 ease-in-out text-white font-semibold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${loading ? 'cursor-wait' : ''}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating Product...
              </>
            ) : "Update Product"}
          </button>
        </form>
      )}
    </div>
  );
};

export default EditProduct;