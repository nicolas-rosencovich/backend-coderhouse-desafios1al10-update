const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const productCollection = "products";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Mark title as required
    trim: true, // Remove leading/trailing whitespace
  },
  description: {
    type: String,
    required: true, // Mark description as required
    trim: true, // Remove leading/trailing whitespace
  },
  price: {
    type: Number,
    required: true, // Mark price as required
    min: 0, // Set minimum price to 0 (optional)
  },
  thumbnail: {
    type: String,
    required: true, // Mark thumbnail URL as required
  },
  code: {
    type: String,
    unique: true, // Ensure unique product code
    required: true, // Mark code as required
    uppercase: true, // Convert code to uppercase for consistency (optional)
  },
  stock: {
    type: Number,
    default: 0, // Set default stock to 0
    min: 0, // Set minimum stock to 0 (optional)
  },
  category: {
    type: String, // Optional field for product category
  },
  images: {
    type: [String], // Array for storing multiple image URLs (optional)
  },
}, {
  timestamps: true, // Include automatic timestamps
});

productSchema.plugin(paginate); // Enable pagination

const ProductModel = mongoose.model(productCollection, productSchema);

module.exports = ProductModel;