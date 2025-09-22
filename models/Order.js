const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
  name: String,
  option: String,
  qty: Number,
  price: Number
});

const orderSchema = new mongoose.Schema({
  sessionId: String,
  items: [orderItemSchema],
  total: Number,
  status: { type: String, enum: ['pending','paid','cancelled'], default: 'pending' },
  paymentRef: String,
  createdAt: { type: Date, default: Date.now },
  paidAt: Date
});

module.exports = mongoose.model('Order', orderSchema);
