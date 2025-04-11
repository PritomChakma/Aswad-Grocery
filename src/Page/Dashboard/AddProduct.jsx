// src/components/AddProduct.js
import React, { useState, useEffect } from "react";
// Make sure this path is correct for your project structure
import api from "../../js/api";

// Define API endpoint constants based on Django urls.py
const PRODUCT_URL = "/product/products/";
const IMAGE_URL = "/product/images/";
const ATTRIBUTE_URL = "/product/attributes/";
const CATEGORY_URL = "/product/categories/";

// --- Helper Function to Generate Slugs ---
const slugify = (str) =>
  str
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing whitespace
    .replace(/[^\w\s-]/g, '') // Remove non-word characters (letters, numbers, underscore), excluding spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, or hyphens with a single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

const AddProduct = () => {
  // --- State Variables ---

  // State for the main product details, including slug
  const [productData, setProductData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "",
    stock_quantity: 0,
    is_active: true,
    is_featured: false,
  });

  // State to hold the list of images to be uploaded
  const [images, setImages] = useState([]);
  // State for the image currently being added by the user (Alt Text removed)
  const [currentImage, setCurrentImage] = useState({
    file: null,
    // alt_text: "", // Removed alt_text from image state
    is_main: false,
  });

  // State to hold the list of attributes (variants) to be added
  const [attributes, setAttributes] = useState([]);
  // State for the attribute currently being added by the user (Value removed)
  const [currentAttribute, setCurrentAttribute] = useState({
    name: "",
    // value: "", // Removed value from attribute state
    price: "",
  });

  // State for dropdown options
  const [categories, setCategories] = useState([]);

  // State for UI feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Stores error messages
  const [success, setSuccess] = useState(null); // Stores success messages

  // --- Fetch Initial Data (Categories only) ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoriesRes = await api.get(CATEGORY_URL);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load necessary data (categories). Please try again later.");
      } finally {
          setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Handlers for Product Details ---
  // Updated to automatically generate slug when name changes
  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newProductData = {
      ...productData,
      [name]: type === "checkbox" ? checked : value,
    };

    // If the name field was changed, update the slug automatically
    if (name === "name") {
      newProductData.slug = slugify(value);
    }

    setProductData(newProductData);
    console.log("Product Data Updated:", newProductData);
  };

  // --- Handlers for Images ---
  // Updated to handle only file and is_main
  const handleCurrentImageChange = (e) => {
    const { name, type, checked, files } = e.target;
    if (type === "file") {
      setCurrentImage({ ...currentImage, file: files[0] });
    } else if (name === "is_main" && type === "checkbox") { // Check specifically for is_main checkbox
      setCurrentImage({ ...currentImage, is_main: checked });
    }
  };

  // Updated to remove alt_text requirement and reset
  const addImage = () => {
    if (!currentImage.file) { // Removed check for alt_text
      alert("Please provide an image file."); // Updated alert message
      return;
    }
    // currentImage no longer includes alt_text
    const newImage = { ...currentImage, id: Date.now() };
    let updatedImages = [...images];
    if (newImage.is_main) {
      updatedImages = updatedImages.map(img => ({ ...img, is_main: false }));
    }
    setImages([...updatedImages, newImage]);
    setCurrentImage({ file: null, is_main: false }); // Removed alt_text reset
    const fileInput = document.getElementById('image-file-input');
    if (fileInput) fileInput.value = "";
  };

  const removeImage = (idToRemove) => {
    setImages(images.filter((img) => img.id !== idToRemove));
  };

  const toggleMainImage = (idToToggle) => {
    setImages(images.map(img => ({
        ...img,
        is_main: img.id === idToToggle
    })));
  };

  // --- Handlers for Attributes ---
  // Handler remains the same, but will no longer be triggered for 'value' input
  const handleCurrentAttributeChange = (e) => {
    const { name, value } = e.target;
    setCurrentAttribute({ ...currentAttribute, [name]: value });
  };

  // Updated to remove value requirement and reset
  const addAttribute = () => {
    // Removed check for currentAttribute.value
    if (!currentAttribute.name || currentAttribute.price === "") {
      alert("Please fill in all attribute fields (Name, Price)."); // Updated alert
      return;
    }
    // currentAttribute no longer includes value
    setAttributes([...attributes, { ...currentAttribute, id: Date.now() }]);
    setCurrentAttribute({ name: "", price: "" }); // Removed value reset
  };

  const removeAttribute = (idToRemove) => {
    setAttributes(attributes.filter((attr) => attr.id !== idToRemove));
  };

  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // --- Frontend Validation ---
    if (!productData.name || !productData.category || productData.stock_quantity < 0 ) {
        setError("Please fill in all required product fields (Name, Category, Stock >= 0).");
        setLoading(false);
        return;
    }
    if (images.length === 0) {
        setError("Please add at least one product image.");
        setLoading(false);
        return;
    }
    if (!images.some(img => img.is_main)) {
        setError("Please mark one image as the main image.");
        setLoading(false);
        return;
    }

    let createdProductId = null;

    try {
      // --- Step 1: Create the Product ---
      const productPayload = {
        ...productData,
        category: parseInt(productData.category, 10),
        stock_quantity: parseInt(productData.stock_quantity, 10),
      };
      console.log("Submitting Product Data:", productPayload);
      const productRes = await api.post(PRODUCT_URL, productPayload);
      createdProductId = productRes.data.id;
      console.log("Product Created Successfully, ID:", createdProductId);

      // --- Step 2: Create Images --- (Removed alt_text from payload)
      const imagePromises = images.map((img, index) => {
        const formData = new FormData();
        formData.append("product", createdProductId);
        formData.append("image", img.file);
        // formData.append("alt_text", img.alt_text); // Removed alt_text
        formData.append("is_main", img.is_main);
        formData.append('position', index);
        console.log(`Submitting Image ${index + 1}:`, { product: createdProductId, /* removed alt_text */ is_main: img.is_main, position: index }); // Updated log
        return api.post(IMAGE_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      });

      // --- Step 3: Create Attributes --- (Removed value from payload)
      const attributePromises = attributes.map((attr, index) => {
        const attributePayload = {
          product: createdProductId,
          name: attr.name,
          // value: attr.value, // Removed value
          price: parseFloat(attr.price).toFixed(2),
        };
        console.log(`Submitting Attribute ${index + 1}:`, attributePayload);
        return api.post(ATTRIBUTE_URL, attributePayload);
      });

      // --- Step 4: Wait for uploads ---
      await Promise.all([...imagePromises, ...attributePromises]);
      console.log("Images and Attributes Submitted Successfully");

      setSuccess(`Product "${productRes.data.name}" (ID: ${createdProductId}) created successfully!`);

      // --- Step 5: Reset the form ---
      setProductData({
        name: "", slug: "", description: "", category: "", stock_quantity: 0, is_active: true, is_featured: false,
      });
      setImages([]);
      setCurrentImage({ file: null, is_main: false }); // Removed alt_text reset
      setAttributes([]);
      setCurrentAttribute({ name: "", price: "" }); // Removed value reset
        const fileInput = document.getElementById('image-file-input');
        if (fileInput) fileInput.value = "";

    } catch (err) {
        // --- Error Handling ---
        console.error("Error during product creation process:", err.response?.data || err.message || err);
        let errorMessage = "Failed to create product.";
        if (err.response?.data) {
            errorMessage = Object.entries(err.response.data)
                .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                .join(' | ');
        } else if (err.message) {
            errorMessage = err.message;
        }
        if (createdProductId && !success) {
            errorMessage += ` Product (ID: ${createdProductId}) was created, but some images or attributes might have failed to upload. Please check the product details.`;
        }
        setError(errorMessage);

    } finally {
      // --- Final Step: Stop Loading ---
      setLoading(false);
    }
  };

  // --- JSX ---
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-xl my-8 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 border-b pb-4">
        Add New Product
      </h1>

      {/* Display Loading, Error, or Success Messages */}
      {loading && <div className="text-center text-blue-600 p-3">Processing...</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* === Product Details Section === */}
        <fieldset className="border p-5 rounded-lg shadow-sm bg-white transition-shadow hover:shadow-md">
          <legend className="text-xl font-semibold px-2 text-gray-900 mb-4">Product Details</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">Name <span className="text-red-500">*</span></label>
              <input
                type="text" id="name" name="name"
                value={productData.name} onChange={handleProductChange}
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" required
              />
            </div>
            {/* Slug (Auto-generated & Read-only) */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-900 mb-1">Slug (auto-generated)</label>
              <input
                type="text" id="slug" name="slug"
                value={productData.slug}
                readOnly // Make it read-only
                className="w-full border border-gray-300 p-2 rounded-md bg-gray-100 focus:outline-none focus:ring-0 text-gray-500 cursor-not-allowed" // Style as read-only
              />
            </div>
              {/* Stock Quantity */}
            <div>
              <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-900 mb-1">Stock Quantity <span className="text-red-500">*</span></label>
              <input
                type="number" id="stock_quantity" name="stock_quantity" min="0"
                value={productData.stock_quantity} onChange={handleProductChange}
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" required
              />
            </div>
            {/* Category Selection */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-1">Category <span className="text-red-500">*</span></label>
              <select
                id="category" name="category" value={productData.category} onChange={handleProductChange}
                className="w-full border border-gray-300 p-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" required
              >
                <option value="">-- Select Category --</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
              {/* Product Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-1">Description</label>
              <textarea
                id="description" name="description" value={productData.description} onChange={handleProductChange}
                rows="4"
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                placeholder="Enter a detailed description of the product..."
              ></textarea>
            </div>
            {/* Status Checkboxes */}
            <div className="md:col-span-2 flex items-center gap-6 pt-2">
              <label htmlFor="is_active" className="flex items-center gap-2 text-sm font-medium text-gray-900 cursor-pointer">
                <input type="checkbox" id="is_active" name="is_active" checked={productData.is_active} onChange={handleProductChange} className="rounded h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"/> Active
              </label>
              <label htmlFor="is_featured" className="flex items-center gap-2 text-sm font-medium text-gray-900 cursor-pointer">
                <input type="checkbox" id="is_featured" name="is_featured" checked={productData.is_featured} onChange={handleProductChange} className="rounded h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"/> Featured
              </label>
            </div>
          </div>
        </fieldset>

        {/* === Image Upload Section === */}
        <fieldset className="border p-5 rounded-lg shadow-sm bg-white transition-shadow hover:shadow-md">
          <legend className="text-xl font-semibold px-2 text-gray-900 mb-4">Product Images <span className="text-red-500">*</span></legend>
          {/* Input fields for adding a new image */}
          <div className="flex flex-col sm:flex-row gap-4 items-end mb-6 p-4 border rounded-md bg-gray-50">
              {/* File Input */}
              <div className="flex-grow w-full sm:w-auto">
                  <label htmlFor="image-file-input" className="block text-sm font-medium text-gray-900 mb-1">Image File <span className="text-red-500">*</span></label>
                  <input
                      type="file" id="image-file-input" name="file"
                      onChange={handleCurrentImageChange}
                      accept="image/png, image/jpeg, image/gif, image/webp" // Specify accepted types
                      className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
              </div>

              {/* Alt Text Input - REMOVED */}
              {/* <div className="flex-grow w-full sm:w-auto">
                  <label htmlFor="alt_text" className="block text-sm font-medium text-gray-900 mb-1">Alt Text <span className="text-red-500">*</span></label>
                  <input
                      type="text" name="alt_text" placeholder="Describe the image"
                      value={currentImage.alt_text} onChange={handleCurrentImageChange}
                      className="w-full border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                  />
              </div> */}

              {/* Main Image Checkbox */}
              <div className="flex items-center pt-5 whitespace-nowrap">
                  <input type="checkbox" name="is_main" id="is_main_current" checked={currentImage.is_main} onChange={handleCurrentImageChange} className="rounded mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"/>
                  <label htmlFor="is_main_current" className="text-sm font-medium text-gray-900 cursor-pointer">Set as Main?</label>
              </div>
              {/* Add Image Button */}
              <button type="button" onClick={addImage} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition duration-150 ease-in-out shadow-sm hover:shadow whitespace-nowrap w-full sm:w-auto">
                  Add Image
              </button>
          </div>

          {/* List of added images */}
          {images.length > 0 && (
              <div className="space-y-3 mt-4">
                  <h4 className="text-md font-semibold text-gray-600 mb-2 border-t pt-4">Added Images (Mark one as main):</h4>
                  {images.map((img, index) => (
                      <div key={img.id} className="flex items-center justify-between gap-3 p-3 border rounded-md bg-gray-50 hover:bg-gray-100 text-sm transition duration-150 ease-in-out">
                          {/* Image Preview and Info */}
                          <div className="flex items-center gap-3 overflow-hidden flex-grow">
                              {img.file && <img src={URL.createObjectURL(img.file)} alt="Preview" className="w-12 h-12 object-cover rounded-md border"/>}
                              <div className="flex flex-col overflow-hidden">
                                  <span className="font-medium text-gray-800 truncate flex-shrink min-w-0">{img.file?.name}</span>
                                  {/* Alt text display - REMOVED */}
                                  {/* <span className="text-gray-600 truncate flex-shrink min-w-0">Alt: {img.alt_text}</span> */}
                              </div>
                          </div>
                          {/* Actions: Set Main / Remove */}
                          <div className="flex items-center gap-4 flex-shrink-0">
                              <label htmlFor={`main-${img.id}`} className={`flex items-center gap-1 cursor-pointer px-2 py-1 rounded ${img.is_main ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-200'}`}>
                                  <input type="radio" id={`main-${img.id}`} name="main_image_selector" checked={img.is_main} onChange={() => toggleMainImage(img.id)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"/>
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
            {/* Input fields for adding a new attribute */}
            <div className="flex flex-col sm:flex-row gap-4 items-end mb-6 p-4 border rounded-md bg-gray-50">
                {/* Attribute Name */}
                <div className="flex-grow w-full sm:w-auto">
                    <label className="block text-sm font-medium text-gray-900 mb-1">Attribute Name <span className="text-red-500">*</span></label>
                    <input
                        type="text" name="name" placeholder="e.g., Size, Color"
                        value={currentAttribute.name} onChange={handleCurrentAttributeChange}
                        className="w-full border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    />
                </div>

                {/* Attribute Value - REMOVED */}
                {/* <div className="flex-grow w-full sm:w-auto">
                    <label className="block text-sm font-medium text-gray-900 mb-1">Attribute Value <span className="text-red-500">*</span></label>
                    <input
                        type="text" name="value" placeholder="e.g., Large, Red"
                        value={currentAttribute.value} onChange={handleCurrentAttributeChange}
                        className="w-full border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    />
                </div> */}

                {/* Attribute Price */}
                <div className="flex-grow w-full sm:w-auto">
                    <label className="block text-sm font-medium text-gray-900 mb-1">Price <span className="text-red-500">*</span></label>
                    <input
                        type="number" name="price" placeholder="e.g., 99.99" step="0.01" min="0"
                        value={currentAttribute.price} onChange={handleCurrentAttributeChange}
                        className="w-full border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    />
                </div>
                {/* Add Attribute Button */}
                <button type="button" onClick={addAttribute} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition duration-150 ease-in-out shadow-sm hover:shadow whitespace-nowrap w-full sm:w-auto">
                    Add Attribute
                </button>
            </div>

            {/* List of added attributes */}
            {attributes.length > 0 && (
                <div className="space-y-3 mt-4">
                    <h4 className="text-md font-semibold text-gray-600 mb-2 border-t pt-4">Added Attributes:</h4>
                    {attributes.map((attr) => (
                        <div key={attr.id} className="flex items-center justify-between gap-3 p-3 border rounded-md bg-gray-50 hover:bg-gray-100 text-sm transition duration-150 ease-in-out">
                            {/* Attribute Info - Value removed */}
                            <span className="font-medium text-gray-800">{attr.name}</span> {/* Removed ': {attr.value}' */}
                            <span className="text-gray-600">(${parseFloat(attr.price || 0).toFixed(2)})</span>
                            {/* Remove Button */}
                            <button type="button" onClick={() => removeAttribute(attr.id)} className="text-red-600 hover:text-red-800 font-semibold text-xs uppercase tracking-wide ml-auto pl-4">Remove</button>
                        </div>
                    ))}
                </div>
            )}
        </fieldset>

        {/* === Submit Button === */}
        <button
          type="submit"
          disabled={loading} // Disable button while loading
          className={`w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 transition duration-150 ease-in-out text-white font-semibold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${loading ? 'cursor-wait' : ''}`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Product...
            </>
          ) : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;