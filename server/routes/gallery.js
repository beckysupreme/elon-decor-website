const express = require('express');
const router = express.Router();
const db = require('../database');
const { uploadImage, cloudinary } = require('../config/cloudinary');

// Get all gallery images or filter by category
router.get('/', async (req, res) => {
  try {
    const category = req.query.category || 'all';
    const images = db.getGalleryImagesByCategory(category);
    res.json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery images',
    });
  }
});

// Upload new image to gallery (admin only)
router.post('/upload', uploadImage.single('image'), async (req, res) => {
  try {
    const { title, category, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded',
      });
    }

    const newImage = db.addGalleryImage({
      title: title || 'Untitled',
      category: category || 'other',
      description: description || '',
      imageUrl: req.file.path,
      publicId: req.file.filename,
    });

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: newImage,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
    });
  }
});

// Delete image from gallery
router.delete('/:id', async (req, res) => {
  try {
    const image = db.getGalleryImages().find(img => img.id === req.params.id);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    // Delete from Cloudinary if it has a publicId
    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    // Delete from database
    const deleted = db.deleteGalleryImage(req.params.id);
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Image deleted successfully',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
    });
  }
});

module.exports = router;