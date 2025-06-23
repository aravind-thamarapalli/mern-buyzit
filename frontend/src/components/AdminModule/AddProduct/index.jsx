  import React, { useEffect, useState } from 'react';
  import { useForm } from 'react-hook-form';
  import { yupResolver } from '@hookform/resolvers/yup';
  import * as yup from 'yup';
  import './AddProduct.css';

  const schema = yup.object().shape({
      name: yup.string().required('Name is required'),
      description: yup.string(),
      price: yup.number().required('Price is required').positive('Price must be a positive number'),
      category: yup.string().required('Category is required'),
      stock: yup.number().default(0).integer('Stock must be an integer'),
      discount: yup.number().default(0).min(0, 'Discount must be between 0 and 100').max(100, 'Discount must be between 0 and 100'),
      imageUrl: yup.mixed().required('Product image is required'), // File validation
  });

  const ProductForm = () => {
      const [categories, setCategories] = useState([]);
      const [loading, setLoading] = useState(false);
      const token = localStorage.getItem("token");

      const {
          register,
          handleSubmit,
          reset,
          formState: { errors },
      } = useForm({
          resolver: yupResolver(schema),
      });

      useEffect(() => {
          const fetchCategories = async () => {
              try {
                  const response = await fetch('http://localhost:5000/api/categories', {
                      method: "GET",
                      headers: {
                          'Authorization': `Bearer ${token}`,
                      },
                  });
                  
                  if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  
                  const data = await response.json();
                  console.log(data);
                  setCategories(data.categories);
              } catch (error) {
                  console.error('Error fetching categories:', error);
                  alert('Error fetching categories. Please refresh the page.');
              }
          };

          if (token) {
              fetchCategories();
          }
      }, [token]);

      const onSubmit = async (data) => {
          setLoading(true);
          
          try {
              // Create FormData properly
              const formData = new FormData();
              formData.append('name', data.name);
              formData.append('description', data.description || '');
              formData.append('price', data.price);
              formData.append('category', data.category);
              formData.append('stock', data.stock || 0);
              formData.append('discount', data.discount || 0);

              // Get the file from the input using react-hook-form
              const fileList = data.imageUrl;
              if (fileList && fileList[0]) {
                  formData.append('image', fileList[0]);
              } else {
                  alert('Please select an image file');
                  setLoading(false);
                  return;
              }

              console.log('Submitting form data...');
              
              // Log FormData contents for debugging
              for (let pair of formData.entries()) {
                  console.log(pair[0] + ': ' + pair[1]);
              }

              const response = await fetch('http://localhost:5000/api/add-products', {
                  method: 'POST',
                  headers: {
                      'Authorization': `Bearer ${token}`,
                      // Don't set Content-Type header - let browser set it with boundary for FormData
                  },
                  body: formData,
              });

              console.log('Response status:', response.status);
              console.log('Response headers:', response.headers);

              // Check if response is JSON
              const contentType = response.headers.get('content-type');
              if (!contentType || !contentType.includes('application/json')) {
                  // If it's not JSON, get the text to see what the server returned
                  const textResponse = await response.text();
                  console.error('Non-JSON response:', textResponse);
                  throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`);
              }

              const result = await response.json();

              if (!response.ok) {
                  throw new Error(result.message || `HTTP error! status: ${response.status}`);
              }

              console.log('Success:', result);
              alert('Product added successfully!');
              reset();
              
          } catch (error) {
              console.error('Error adding product:', error);
              alert(`Error adding product: ${error.message}`);
          } finally {
              setLoading(false);
          }
      };

      if (!token) {
          return (
              <div className="product-form-container">
                  <p>Please log in to add products.</p>
              </div>
          );
      }

      return (
          <div className="product-form-container">
              <h2 className="product-form-title">Add New Product</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="product-form">
                  <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input type="text" id="name" {...register("name")} />
                      {errors.name && (
                          <span className="error-message">{errors.name.message}</span>
                      )}
                  </div>
                  
                  <div className="form-group">
                      <label htmlFor="description">Description</label>
                      <textarea id="description" {...register("description")} />
                  </div>
                  
                  <div className="form-group">
                      <label htmlFor="price">Price</label>
                      <input 
                          type="number" 
                          step="0.01" 
                          id="price" 
                          {...register("price", { valueAsNumber: true })} 
                      />
                      {errors.price && (
                          <span className="error-message">{errors.price.message}</span>
                      )}
                  </div>
                  
                  <div className="form-group">
                      <label htmlFor="category">Category</label>
                      <select id="category" {...register("category")}>
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                              <option key={category._id} value={category._id}>
                                  {category.name}
                              </option>
                          ))}
                      </select>
                      {errors.category && (
                          <span className="error-message">{errors.category.message}</span>
                      )}
                  </div>
                  
                  <div className="form-group">
                      <label htmlFor="imageUrl">Image</label>
                      <input
                          type="file"
                          id="imageUrl"
                          accept="image/*"
                          {...register("imageUrl", { required: "Image is required" })}
                      />
                      {errors.imageUrl && (
                          <span className="error-message">{errors.imageUrl.message}</span>
                      )}
                  </div>
                  
                  <div className="form-group">
                      <label htmlFor="stock">Stock</label>
                      <input 
                          type="number" 
                          id="stock" 
                          {...register("stock", { valueAsNumber: true })} 
                      />
                      {errors.stock && (
                          <span className="error-message">{errors.stock.message}</span>
                      )}
                  </div>
                  
                  <div className="form-group">
                      <label htmlFor="discount">Discount (%)</label>
                      <input 
                          type="number" 
                          step="0.01" 
                          max="100" 
                          min="0" 
                          id="discount" 
                          {...register("discount", { valueAsNumber: true })} 
                      />
                      {errors.discount && (
                          <span className="error-message">{errors.discount.message}</span>
                      )}
                  </div>
                  
                  <div className="form-group">
                      <button 
                          type="submit" 
                          className="submit-button"
                          disabled={loading}
                      >
                          {loading ? 'Adding Product...' : 'Add Product'}
                      </button>
                  </div>
              </form>
          </div>
      );
  };

  export default ProductForm;