const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  options: [String],
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
