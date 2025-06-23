const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require("./models/Category");
const Order = require('./models/Order');
const Payment = require("./models/Payment");
const Address = require("./models/Address");
const Cart = require("./models/Cart");
const bcrypt = require("bcrypt");
const multer = require('multer');
const path = require('path');
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();

// CORS configuration - fix the CORS setup
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "https://mern-buyzit.vercel.app"], // Add your frontend URLs
    credentials: true
}));

require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cloudinary configuration with validation
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Missing Cloudinary environment variables');
    process.exit(1);
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test Cloudinary connection
cloudinary.api.ping((error, result) => {
    if (error) {
        console.error('Cloudinary connection failed:', error);
    } else {
        console.log('Cloudinary connected successfully');
    }
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'grocery-products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
        ]
    }
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// MongoDB connection with better error handling
const mongoURI = process.env.DB_STRING;
if (!mongoURI) {
    console.error('Missing MongoDB connection string');
    process.exit(1);
}

mongoose.connect(mongoURI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// JWT verification middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET || '1234567', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        req.user = decoded;
        next();
    });
};

// Admin verification middleware
const verifyAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    next();
};

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ message: 'File upload error: ' + err.message });
    }
    if (err.message === 'Only image files are allowed!') {
        return res.status(400).json({ message: err.message });
    }
    next(err);
};

// User registration
app.post('/api/register', async (req, res) => {
    const { username, phone, email, password } = req.body;

    try {
        // Validate required fields
        if (!username || !phone || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const existingUser = await User.findOne({ 
            $or: [{ phone }, { email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User already exists with this phone number, email, or username.' 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            username,
            phone,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ 
            message: 'User registered successfully', 
            user: { 
                id: newUser._id, 
                username: newUser.username, 
                email: newUser.email,
                phone: newUser.phone
            } 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error during registration' });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin }, 
            process.env.JWT_SECRET || "1234567", 
            { expiresIn: '24h' }
        );

        res.status(200).json({ 
            message: 'Login successful', 
            token, 
            user: { 
                id: user._id,
                username: user.username, 
                phone: user.phone, 
                email: user.email, 
                isAdmin: user.isAdmin
            } 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error during login' });
    }
});

// Add products with improved error handling
app.post('/api/add-products', verifyToken, verifyAdmin, upload.single('image'), async (req, res) => {
    const { name, description, price, category, stock, discount } = req.body;
   
    try {
        console.log('Add product request received:', {
            body: req.body,
            file: req.file ? 'Present' : 'Missing',
            user: req.user.id
        });

        // Validate required fields
        if (!name || !price || !category) {
            if (req.file && req.file.public_id) {
                await cloudinary.uploader.destroy(req.file.public_id);
            }
            return res.status(400).json({ message: 'Name, price, and category are required.' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Product image is required.' });
        }

        // Validate price
        const productPrice = parseFloat(price);
        if (isNaN(productPrice) || productPrice <= 0) {
            if (req.file.public_id) {
                await cloudinary.uploader.destroy(req.file.public_id);
            }
            return res.status(400).json({ message: 'Price must be a valid positive number.' });
        }

        // Validate category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            console.log('Category not found:', category);
            if (req.file.public_id) {
                await cloudinary.uploader.destroy(req.file.public_id);
            }
            return res.status(400).json({ message: 'Invalid category selected.' });
        }

        console.log('Image uploaded to Cloudinary:', {
            url: req.file.path,
            publicId: req.file.public_id
        });

        const newProduct = new Product({
            name: name.trim(),
            description: description ? description.trim() : '',
            price: productPrice,
            category: category,
            imageUrl: req.file.path,
            cloudinaryPublicId: req.file.public_id,
            stock: parseInt(stock) || 0,
            discount: parseFloat(discount) || 0
        });

        const savedProduct = await newProduct.save();
        console.log('Product saved successfully:', savedProduct._id);
        
        // Populate category for response
        await savedProduct.populate('category', 'name');
        
        res.status(201).json({ 
            message: 'Product added successfully', 
            product: savedProduct 
        });
    
    } catch (error) {
        console.error('Error in add-products:', error);
        
        // Clean up uploaded image on error
        if (req.file && req.file.public_id) {
            try {
                await cloudinary.uploader.destroy(req.file.public_id);
                console.log('Cleaned up uploaded image due to error');
            } catch (cleanupError) {
                console.error('Error cleaning up uploaded image:', cleanupError);
            }
        }
        
        res.status(500).json({ 
            error: 'Internal server error while adding product',
            message: error.message 
        });
    }
});

// Update product image
app.put('/api/products/:id/image', verifyToken, verifyAdmin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided.' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            if (req.file.public_id) {
                await cloudinary.uploader.destroy(req.file.public_id);
            }
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Delete old image from Cloudinary if it exists
        if (product.cloudinaryPublicId) {
            try {
                await cloudinary.uploader.destroy(product.cloudinaryPublicId);
                console.log('Old image deleted from Cloudinary');
            } catch (deleteError) {
                console.error('Error deleting old image:', deleteError);
            }
        }

        // Update product with new image
        product.imageUrl = req.file.path;
        product.cloudinaryPublicId = req.file.public_id;
        await product.save();

        res.status(200).json({ 
            message: 'Product image updated successfully', 
            product 
        });
    } catch (error) {
        console.error('Error updating product image:', error);
        
        // Clean up uploaded file on error
        if (req.file && req.file.public_id) {
            try {
                await cloudinary.uploader.destroy(req.file.public_id);
            } catch (cleanupError) {
                console.error('Error cleaning up uploaded image:', cleanupError);
            }
        }
        res.status(500).json({ error: 'Internal server error while updating image' });
    }
});

// Add categories
app.post('/api/categories', verifyToken, verifyAdmin, async (req, res) => {
    const { name } = req.body;

    try {
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Category name is required.' });
        }

        const existingCategory = await Category.findOne({ 
            name: { $regex: new RegExp('^' + name.trim() + '$', 'i') } 
        });
        
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists.' });
        }

        const newCategory = new Category({ name: name.trim() });
        await newCategory.save();
        res.status(201).json({ 
            message: 'Category added successfully', 
            category: newCategory 
        });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ error: 'Internal server error while adding category' });
    }
});

// Get categories
app.get("/api/categories", async(req, res) => {
    try{
        const categories = await Category.find().sort({ name: 1 });
        res.status(200).json({categories})
    }catch(error){
        console.error('Error fetching categories:', error);
        res.status(500).json({message: 'Error fetching categories'})
    }
});

// Get products with population
app.get("/api/get-products", async(req, res) => {
    try{
        const products = await Product.find()
            .populate('category', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json({products})
    }catch(error){
        console.error('Error fetching products:', error);
        res.status(500).json({message: 'Error fetching products'})
    }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const product = await Product.findById(productId).populate('category', 'name');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Cart operations (keeping your existing logic with minor improvements)
app.post('/cart/add', verifyToken, async (req, res) => {
    const { productId, quantity } = req.body;
    const { id } = req.user;
    const userId = id;
  
    try {
        // Validate inputs
        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Product ID and quantity are required' });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be a positive number' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [], totalPrice: 0 });
        }

        const product = await Product.findById(productId); 
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check stock availability
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock available' });
        }

        const existingItemIndex = cart.items.findIndex(item => 
            item.productId.toString() === productId
        );
  
        if (existingItemIndex > -1) {
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;
            if (product.stock < newQuantity) {
                return res.status(400).json({ message: 'Insufficient stock for requested quantity' });
            }
            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            cart.items.push({ productId, quantity }); 
        }

        // Recalculate total price
        let totalPrice = 0;
        for (const item of cart.items) {
            const itemProduct = await Product.findById(item.productId);
            if (itemProduct) {
                const discountedPrice = itemProduct.price * (1 - itemProduct.discount / 100);
                totalPrice += discountedPrice * item.quantity;
            }
        }
  
        cart.totalPrice = totalPrice; 
        await cart.save();
        
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get cart
app.get('/cart', verifyToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id })
            .populate({
                path: 'items.productId',
                populate: {
                    path: 'category',
                    select: 'name'
                }
            });
            
        if (!cart) {
            return res.status(200).json({ items: [], totalPrice: 0 });
        }
        
        res.json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update cart item
app.put('/cart/:productId', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.productId;
    const { quantity } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be greater than zero.' });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => 
            item.productId.toString() === productId
        );
        
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Check stock availability
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product no longer exists' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock available' });
        }

        cart.items[itemIndex].quantity = quantity;

        // Recalculate total price
        let totalPrice = 0;
        for (const item of cart.items) {
            const itemProduct = await Product.findById(item.productId);
            if (itemProduct) {
                const discountedPrice = itemProduct.price * (1 - itemProduct.discount / 100);
                totalPrice += discountedPrice * item.quantity;
            }
        }

        cart.totalPrice = totalPrice;
        await cart.save();
        
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Rest of your existing endpoints with minor improvements...
// (Address, Order, Users, Delete operations remain mostly the same)

// Add address
app.post('/add-address', verifyToken, async (req, res) => {
    const { label, recipientName, doorNo, buildingName, street, landmark, pinCode } = req.body;
    
    try {
        if (!label || !recipientName || !doorNo || !street || !pinCode) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        const newAddress = new Address({
            userId: req.user.id,
            label: label.trim(),
            recipientName: recipientName.trim(),
            doorNo: doorNo.trim(),
            buildingName: buildingName ? buildingName.trim() : '',
            street: street.trim(),
            landmark: landmark ? landmark.trim() : '',
            pinCode: pinCode.trim(),
        });
  
        await newAddress.save();
        res.status(201).json({ 
            message: 'Address added successfully!', 
            address: newAddress 
        });
    } catch (error) {
        console.error('Error adding address:', error);
        res.status(500).json({ message: 'Error adding address', error: error.message });
    }
});

// Create order
app.post('/order', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { paymentMethod, addressId } = req.body;

        if (!paymentMethod) {
            return res.status(400).json({ message: 'Payment method is required' });
        }
  
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Check stock availability for all items
        for (const item of cart.items) {
            if (item.productId.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for ${item.productId.name}` 
                });
            }
        }
  
        let totalAmount = 0;
        const orderProducts = cart.items.map((item) => {
            const product = item.productId;
            const discountedPrice = product.price * (1 - product.discount / 100);
            totalAmount += discountedPrice * item.quantity;
  
            return {
                product: product._id,
                quantity: item.quantity,
                price: discountedPrice,
            };
        });
  
        const newOrder = new Order({
            user: userId,
            products: orderProducts,
            totalAmount,
            paymentMethod,
            address: addressId,
            status: 'pending'
        });
  
        const savedOrder = await newOrder.save();

        // Update product stock
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(
                item.productId._id,
                { $inc: { stock: -item.quantity } }
            );
        }

        // Clear cart
        await Cart.findOneAndUpdate({ userId }, { items: [], totalPrice: 0 });
  
        res.status(201).json({ 
            message: 'Order placed successfully', 
            order: savedOrder 
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error while creating order' });
    }
});

// Get user orders
app.get('/orders', verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('user', 'username email')
            .populate('products.product', 'name price imageUrl')
            .sort({ createdAt: -1 });
  
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to retrieve orders', error });
    }
});

// Get all orders (admin only)
app.get('/all-orders', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'username email phone')
            .populate('products.product', 'name price imageUrl')
            .sort({ createdAt: -1 });
            
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Error fetching orders', error });
    }
});


app.put('/all-orders/:orderId/status', verifyToken, verifyAdmin, async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'shipped', 'delivered', 'canceled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = status;
    await order.save();

    res.status(200).json({
      message: `✅ Order status updated to "${status}"`,
      order,
    });
  } catch (error) {
    console.error('❌ Error updating order status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Get users (admin only)
app.get('/api/users', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await User.find({}, 'username email phone createdAt isAdmin').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// Delete product (admin only)
app.delete('/api/products/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete image from Cloudinary if it exists
        if (product.cloudinaryPublicId) {
            try {
                await cloudinary.uploader.destroy(product.cloudinaryPublicId);
                console.log('Product image deleted from Cloudinary');
            } catch (cloudinaryError) {
                console.error('Error deleting image from Cloudinary:', cloudinaryError);
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error while deleting product', error });
    }
});

// Delete category (admin only)
app.delete('/api/categories/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        // Check if any products use this category
        const productsUsingCategory = await Product.countDocuments({ category: req.params.id });
        if (productsUsingCategory > 0) {
            return res.status(400).json({ 
                message: 'Cannot delete category. Products are still using this category.' 
            });
        }

        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Server error while deleting category', error });
    }
});

// Delete user (admin only)
app.delete('/api/users/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Prevent deleting yourself
        if (req.params.id === req.user.id) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error while deleting user', error });
    }
});

// Error handling middleware
app.use(handleMulterError);

app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});