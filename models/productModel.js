const mongoose = require('mongoose');


// Define the custom validator function FIRST
function arrayLimit(val) {
  return val.length > 0;
}

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  tags: {
    type: [String],
    default: []
  },
  trending: {
    type: Boolean,
    default: false
  },
  special: {
    type: Boolean,
    default: false
  },
  handpicked: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: [String], // array of image URLs
    required: true,
    validate: [arrayLimit, '{PATH} must have at least one image']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);
