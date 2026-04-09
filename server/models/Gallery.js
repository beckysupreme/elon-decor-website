const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true, default: 'other' },
  description: { type: String, default: '' },
  imageUrl: { type: String, required: true },
  publicId: { type: String },
  type: { type: String, default: 'image' },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', gallerySchema);