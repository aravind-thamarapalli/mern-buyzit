import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './index.css';

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
                        'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                    },
                });
                const data = await response.json();
                console.log(data);
                setCategories(data.categories); // Assuming the response contains an array of categories
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, [token]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('category', data.category);
        formData.append('stock', data.stock);
        formData.append('discount', data.discount);

        const fileInput = document.querySelector('#imageUrl');
        const file = fileInput.files[0];
        console.log(file)
        formData.append('image', file);

        console.log(formData); // Log FormData for debugging

        try {
            const response = await fetch('http://localhost:5000/api/add-products', {
                method: 'POST',
                // No need to set Content-Type; browser will automatically set it.
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            alert('Product added successfully!');
            reset()
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Error adding product');
        }
    };

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
            <input type="number" id="price" {...register("price")} />
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
              {...register("imageUrl", { required: "Image is required" })}
            />
            {errors.imageUrl && (
              <span className="error-message">{errors.imageUrl.message}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input type="number" id="stock" {...register("stock")} />
          </div>
          <div className="form-group">
            <label htmlFor="discount">Discount (%)</label>
            <input type="number" id="discount" {...register("discount")} />
          </div>
          <div className="form-group">
            <button type="submit" className="submit-button">
              Add Product
            </button>
          </div>
        </form>
      </div>
    );
};

export default ProductForm;
