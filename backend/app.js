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
const app = express();
app.use(cors("*"));


app.use(bodyParser.json());


const mongoURI = 'mongodb://localhost:27017/buyzit';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });
    
    const upload = multer({ storage });


const verifyToken = (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
    
        jwt.verify(token, '1234567', (err, decoded) => {
            if (err) {
                return res.status(400).json({ message: 'Invalid token.' });
            }
            req.user = decoded;
            console.log(req.user)
            next();
        });
    
};



app.post('/api/register', async (req, res) => {
    const { username, phone, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this mobile number.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            phone,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body)
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials. User not found.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials. Password does not match.' });
        }
        const token = jwt.sign({ id: user._id,isAdmin:user.isAdmin}, "1234567", { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, user: { username: user.username, phone: user.phone, email: user.email,isAdmin:user.isAdmin} });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/add-products', verifyToken, upload.single('image'), async (req, res) => {
    const { name, description, price, category, stock, discount } = req.body;
   
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const imgId = req.file.path;
        const updatedImgId = imgId.slice(8);

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            imageUrl: updatedImgId,
            stock,
            discount
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    
      } catch (error) {
        res.status(400).json({ error: error.message });
    }

  });

app.post('/api/categories', verifyToken, async (req, res) => {
    const { name } = req.body;

    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists.' });
        }

        const newCategory = new Category({ name });
        await newCategory.save();
        res.status(201).json({ message: 'Category added successfully', category: newCategory });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get("/api/categories",async(req,res) =>{
    try{
        const categories = await Category.find()
        res.status(200).json({categories})
    }catch(e){
        res.status(500).json({message: e})
    }
})

app.get("/api/get-products",async(req,res) =>{
    try{
        const products = await Product.find()
        res.status(200).json({products})
    }catch(e){
        res.status(500).json({message:e})
    }
})

app.get('/api/products/:id', async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
});

app.post('/api/cart/add', verifyToken, async (req, res) => {
    const { productId, quantity } = req.body;
  
    const { id } = req.user;
    const userId = id;
  
    try {

      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [], totalPrice: 0 });
      }

      const product = await Product.findById(productId); 
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      const productPrice = product.price;

      if (typeof productPrice !== 'number' || isNaN(productPrice)) {
        return res.status(400).json({ message: 'Invalid product price' });
      }

      if (typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid quantity' });
      }

      const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
  
      if (existingItemIndex > -1) {

        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity }); 
      }

      let totalPrice = 0;

      for (const item of cart.items) {
        const itemProduct = await Product.findById(item.productId); // Get product details using the productId
        const itemPrice = itemProduct ? itemProduct.price : 0; // Default to 0 if product not found
        totalPrice += itemPrice * item.quantity; // Update total
      }
  
      cart.totalPrice = totalPrice; 

      if (isNaN(cart.totalPrice)) {
        return res.status(400).json({ message: 'Total price calculation error' });
      }

      await cart.save();

      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
});

app.get('/cart', verifyToken, async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
      res.json(cart.items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

app.put('/cart/:productId', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const productId = new mongoose.Types.ObjectId(req.params.productId);
    const { quantity } = req.body;

    console.log(quantity);

    if (!quantity || quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be greater than zero.' });
    }

    console.log('Updating cart for user:', userId);
    console.log('Updating quantity for product:', productId);

    try {
        const cart = await Cart.findOne({ userId: userId, "items.productId": productId });

        if (!cart) {
            console.log('Cart item not found for user or product');
            return res.status(404).json({ message: 'Cart item not found for this user' });
        }

        // Update the quantity of the specific item
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString());
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Product not found in the cart' });
        }

        cart.items[itemIndex].quantity = quantity;

        // Recalculate total price for the cart
        let totalPrice = 0;

        for (const item of cart.items) {
            const product = await Product.findById(item.productId);
            const itemPrice = product ? product.price : 0;
            totalPrice += itemPrice * item.quantity;
        }

        cart.totalPrice = totalPrice;
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/add-address', verifyToken, async (req, res) => {
    const { label, recipientName, doorNo, buildingName, street, landmark, pinCode } = req.body;
    try {
      const newAddress = new Address({
        userId: req.user.id,
        label,
        recipientName,
        doorNo,
        buildingName,
        street,
        landmark,
        pinCode,
      });
  
      await newAddress.save();
      res.status(201).json({ message: 'Address added successfully!', address: newAddress });
    } catch (error) {
      res.status(500).json({ message: 'Error adding address', error: error.message });
    }
});

app.post('/order', verifyToken, async (req, res) => {
    try {
      const userId = req.user.id; // Get user ID from JWT token
  
      // Fetch the user's cart
      const cart = await Cart.findOne({ userId }).populate('items.productId');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
  
      // Prepare order products and calculate the total amount
      let totalAmount = 0;
      const orderProducts = cart.items.map((item) => {
        const product = item.productId;
        const discountedPrice = product.price - (product.price * product.discount) / 100;
        totalAmount += discountedPrice * item.quantity;
  
        return {
          product: product._id,
          quantity: item.quantity,
          price: discountedPrice,
        };
      });
  
      // Create the order
      const newOrder = new Order({
        user: userId,
        products: orderProducts,
        totalAmount,
        paymentMethod: req.body.paymentMethod, // Passed from the client
      });
  
      // Save the order
      const savedOrder = await newOrder.save();
  
      // Clear the user's cart after order creation
      await Cart.findOneAndUpdate({ userId }, { items: [], totalPrice: 0 });
  
      res.status(201).json({ message: 'Order placed successfully', order: savedOrder });
    } catch (err) {
      console.error('Error creating order:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/orders', verifyToken, async (req, res) => {
    try {
      const orders = await Order.find()
        .populate('user', 'name email')
        .populate('products.product', 'name price imageUrl');
  
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve orders', error });
    }
});


app.get('/all-orders', verifyToken, async (req, res) => {
    try {
        const {isAdmin} = req.user
        if(!isAdmin){
            return  res.status(403).json({message: 'You are not authorized to access this endpoint.'})
        }
        const orders = await Order.find()
            .populate({
                path: 'user',
                select: 'name email',
            })
            .populate({
                path: 'products.product', 
                select: 'name price imageUrl',
            })
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
});

//     const { productId, quantity } = req.body;
  
//     try {
//       const userId = req.user.id; 
//       const cart = await Cart.findOne({ userId });
  
//       if (!cart) {
//         return res.status(404).json({ message: 'Cart not found' });
//       }
  
//       // Find the item in the cart
//       const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
  
//       if (itemIndex > -1) {
//         // Update the quantity
//         cart.items[itemIndex].quantity = quantity;
  
//         // Calculate the total price
//         cart.totalPrice = cart.items.reduce((total, item) => {
//           const product =  await Product.findById(item.productId); // Fetch the product to get the price
//           return total + product.price * item.quantity; // Update total price based on the product price
//         }, 0);
  
//         await cart.save();
//         res.status(200).json(cart);
//       } else {
//         res.status(404).json({ message: 'Product not found in cart' });
//       }
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
