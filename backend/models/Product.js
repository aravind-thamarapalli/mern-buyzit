// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to Category model
    imageUrl: { type: String }, // URL for product image
    stock: { type: Number, default: 0 }, // Number of items available
    discount: { type: Number, default: 0 }, // Discount percentage (0-100)
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
