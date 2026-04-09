const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Gallery = require('../models/Gallery');
const { uploadImage, cloudinary } = require('../config/cloudinary');

// Get all images
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    const images = await Gallery.find(filter).sort({ uploadedAt: -1 });
    res.json({ success: true, data: images });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ success: false, message: 'Error fetching images' });
  }
});

// Upload image file
router.post('/upload', uploadImage.single('image'), async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('File:', req.file);
    console.log('Body:', req.body);
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }
    
    const { title, category, description } = req.body;
    
    const newImage = new Gallery({
      title: title || 'Untitled',
      category: category || 'other',
      description: description || '',
      imageUrl: req.file.path,
      publicId: req.file.filename,
      type: 'image'
    });
    
    await newImage.save();
    
    console.log('Image saved:', newImage);
    
    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: newImage
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Error uploading image: ' + error.message });
  }
});

// Delete image - FIXED
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to delete image with ID:', id);
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid image ID format' });
    }
    
    const image = await Gallery.findById(id);
    
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    
    // Delete from Cloudinary if it has a publicId
    if (image.publicId) {
      try {
        await cloudinary.uploader.destroy(image.publicId);
        console.log('Deleted from Cloudinary:', image.publicId);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
      }
    }
    
    const deletedImage = await Gallery.findByIdAndDelete(id);
    console.log('Image deleted successfully:', deletedImage._id);
    
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: 'Error deleting image: ' + error.message });
  }
});

module.exports = router;