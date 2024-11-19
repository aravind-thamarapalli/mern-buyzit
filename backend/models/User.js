const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    phone:{ type: String, required: true, unique:true},
    email: { type: String, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }, // To differentiate between admin and user
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
