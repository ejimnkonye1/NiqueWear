import { useState, } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { apiClient } from "../util/apiclient";

const AddProductForm = ({ onAddProduct, }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',

  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initialize form when editing

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  // Debug form data before submission
  console.log('Form data before submission:', {
    name: formData.name,
    price: formData.price,
    description: formData.description,
    category: formData.category,
    image: image ? image.name : 'No image selected'
  });

  // Validation
  const price = Number(formData.price);
  if (isNaN(price)) {
    toast.error('Please enter a valid price');
    setLoading(false);
    return;
  }

  if (!formData.category) {
    toast.error('Please select a category');
    setLoading(false);
    return;
  }

  try {
    // Create new FormData object (don't reuse the same variable name)
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('price', price.toString()); // Ensure string value
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category', formData.category);
    if (image) {
      formDataToSend.append('image', image);
    }

    // Debug what's actually being sent
    console.log('FormData contents:');
    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, value);
    }

    const response = await apiClient.request(
      `${import.meta.env.VITE_SERVER_URL}/api/admin/products/addproduct`,
      {
        method: 'POST',
        body: formDataToSend,
  
      }
    );

    // Debug raw response
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.message || 'Upload failed');
      // eslint-disable-next-line no-unused-vars
      } catch (parseError) {
        throw new Error(responseText || 'Upload failed' );
       
      }
    }

    const result = JSON.parse(responseText);
    onAddProduct(result);
    toast.success('Product added!');
  } catch (err) {
    console.error('Full error:', err);
    toast.error(err.message || 'Failed to add product');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className=" hidden md:text-lg font-medium mb-6">
         Add New Product
      </h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* Product Name */}
          <div className="sm:col-span-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="py-2 px-3 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="sm:col-span-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="py-2 px-3 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Price */}
          <div className="sm:col-span-3">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₦</span>
              </div>
              <input
                type="number"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleChange}
                className="py-2 pl-7 pr-3 block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

     
     

          {/* Category */}
          <div className="sm:col-span-3">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <div className="mt-1">
           <select
  id="category"
  name="category"
  value={formData.category}
  onChange={handleChange}
  className="py-2 px-3 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
  required
>
  <option value="">Select a category</option>
  <option value="men">Men</option>
  <option value="women">Women</option> {/* Changed from "Women" to "women" */}
  <option value="kids">Kids</option>
</select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">Product Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input 
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      className="sr-only" 
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                {image && (
                  <p className="text-xs text-green-500 mt-2">
                    {image.name} selected
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: '',
                price: '',
                description: '',
                category: '',
                stock: ''
              });
              setImage(null);
              setError('');
              setSuccess('');
            }}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;