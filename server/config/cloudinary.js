const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure storage for images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'elon-decor-gallery',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }],
    resource_type: 'image',
  },
});

// Configure storage for videos
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'elon-decor-videos',
    allowed_formats: ['mp4', 'mov', 'avi', 'webm', 'mkv'],
    resource_type: 'video',
  },
});

// Create upload middleware
const uploadImage = multer({ storage: imageStorage });
const uploadVideo = multer({ storage: videoStorage });

module.exports = { 
  cloudinary, 
  uploadImage, 
  uploadVideo 
};