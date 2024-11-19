const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  recipientName: {
    type: String,
    required: true,
    trim: true,
  },
  doorNo: {
    type: String,
    required: true,
    trim: true,
  },
  buildingName: {
    type: String,
    trim: true,
  },
  street: {
    type: String,
    required: true,
    trim: true,
  },
  landmark: {
    type: String,
    trim: true,
  },
  pinCode: {
    type: String,
    required: true,
    trim: true,
  },
  label: {
    type: String,
    required: true,
    trim: true,
    enum: ['Home', 'Work', 'Other'], // You can extend this with other labels if necessary
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
