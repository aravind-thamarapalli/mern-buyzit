const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    paymentMethod: { type: String, enum: ['credit card', 'debit card', 'paypal', 'cash'], required: true },
    amount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['successful', 'failed', 'pending'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);
