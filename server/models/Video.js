const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true, default: 'other' },
  description: { type: String, default: '' },
  videoUrl: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  publicId: { type: String },
  type: { type: String, default: 'link' }, // 'file' or 'link'
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);