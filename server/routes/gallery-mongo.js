const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Gallery = require('../models/Gallery');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
const imageUploadDir = path.join(uploadDir, 'images');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(imageUploadDir)) {
  fs.mkdirSync(imageUploadDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Get all images
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    const images = await Gallery.find(filter).sort({ uploadedAt: -1 });
    
    const baseUrl = process.env.BASE_URL || 'https://elon-decor-api.onrender.com';
    const imagesWithUrl = images.map(img => ({
      ...img.toObject(),
      imageUrl: img.imageUrl.startsWith('http') ? img.imageUrl : `${baseUrl}${img.imageUrl}`
    }));
    
    res.json({ success: true, data: imagesWithUrl });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ success: false, message: 'Error fetching images' });
  }
});

// Upload image
router.post('/upload', (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
    
    try {
      console.log('File received:', req.file);
      console.log('Body:', req.body);
      
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
      
      const { title, category, description } = req.body;
      const baseUrl = process.env.BASE_URL || 'https://elon-decor-api.onrender.com';
      const imageUrl = `/uploads/images/${req.file.filename}`;
      
      const newImage = new Gallery({
        title: title || 'Untitled',
        category: category || 'other',
        description: description || '',
        imageUrl: imageUrl,
        publicId: req.file.filename,
        type: 'image'
      });
      
      const savedImage = await newImage.save();
      console.log('Image saved:', savedImage);
      
      res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          ...savedImage.toObject(),
          imageUrl: `${baseUrl}${imageUrl}`
        }
      });
    } catch (error) {
      console.error('Save error:', error);
      res.status(500).json({ success: false, message: 'Error saving image: ' + error.message });
    }
  });
});

// Delete image
router.delete('/:id', async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    
    // Delete file from disk
    const filePath = path.join(__dirname, '../', image.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('File deleted:', filePath);
    }
    
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: 'Error deleting image' });
  }
});

module.exports = router;