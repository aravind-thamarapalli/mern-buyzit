import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import './AddCategory.css';
import { categoryAPI } from '../../../services/api'; 

// Validation schema
const categorySchema = yup.object().shape({
    name: yup.string().required('Category name is required'),
    description: yup.string(),
});

const AddCategory = () => {
    // Using react-hook-form
    const {
        register,
        handleSubmit,
        reset, // This will help reset the form after submission
        formState: { errors },
    } = useForm({
        resolver: yupResolver(categorySchema),
    });

    // Submit handler
    const onSubmit = async (data) => {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage (or wherever you store it)

        try {
            const response = await categoryAPI.add(data);

            if (!response.ok) {
                throw new Error('Failed to add category');
            }

            const result = await response.json();
            alert('Category successfully added');

            // Optionally, reset the form after successful submission
            reset();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
      <div className="add-category-form-container">
        <form className="add-category-form" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="form-title">Add Category</h2>

          <div className="form-group">
            <label htmlFor="name">Category Name</label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className={`input ${errors.name ? "input-error" : ""}`}
              placeholder="Enter category name"
            />
            {errors.name && (
              <p className="error-message">{errors.name.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              {...register("description")}
              className="input"
              placeholder="Enter description (optional)"
            />
          </div>
          <div className="form-group">
            <button type="submit" className="submit-button">
              Add Category
            </button>
          </div>
        </form>
      </div>
    );
};

export default AddCategory;
