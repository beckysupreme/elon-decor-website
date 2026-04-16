const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
const videoUploadDir = path.join(uploadDir, 'videos');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(videoUploadDir)) {
  fs.mkdirSync(videoUploadDir, { recursive: true });
}

// Configure multer for video uploads (larger file size limit)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, videoUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /mp4|mov|avi|webm|mkv|mpeg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only video files are allowed (mp4, mov, avi, webm, mkv)'));
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for videos
  fileFilter: fileFilter
});

// Get all videos
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    const videos = await Video.find(filter).sort({ uploadedAt: -1 });
    
    const baseUrl = process.env.BASE_URL || 'https://elon-decor-api.onrender.com';
    const videosWithUrl = videos.map(video => ({
      ...video.toObject(),
      videoUrl: video.type === 'file' && video.videoUrl && !video.videoUrl.startsWith('http') 
        ? `${baseUrl}${video.videoUrl}` 
        : video.videoUrl
    }));
    
    res.json({ success: true, data: videosWithUrl });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ success: false, message: 'Error fetching videos' });
  }
});

// Upload video file
router.post('/upload', (req, res) => {
  upload.single('video')(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
    
    try {
      console.log('Video file received:', req.file);
      console.log('Body:', req.body);
      
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No video file uploaded' });
      }
      
      const { title, category, description } = req.body;
      const baseUrl = process.env.BASE_URL || 'https://elon-decor-api.onrender.com';
      const videoUrl = `/uploads/videos/${req.file.filename}`;
      
      const newVideo = new Video({
        title: title || 'Untitled',
        category: category || 'other',
        description: description || '',
        videoUrl: videoUrl,
        publicId: req.file.filename,
        type: 'file'
      });
      
      const savedVideo = await newVideo.save();
      console.log('Video saved:', savedVideo);
      
      res.status(201).json({
        success: true,
        message: 'Video uploaded successfully',
        data: {
          ...savedVideo.toObject(),
          videoUrl: `${baseUrl}${videoUrl}`
        }
      });
    } catch (error) {
      console.error('Save error:', error);
      res.status(500).json({ success: false, message: 'Error saving video: ' + error.message });
    }
  });
});

// Add YouTube/Vimeo link
router.post('/link', async (req, res) => {
  try {
    const { title, category, videoUrl, description } = req.body;
    
    if (!title || !videoUrl) {
      return res.status(400).json({ success: false, message: 'Title and video URL are required' });
    }
    
    const newVideo = new Video({
      title,
      category: category || 'other',
      videoUrl,
      description: description || '',
      type: 'link'
    });
    
    await newVideo.save();
    
    res.status(201).json({
      success: true,
      message: 'Video link added successfully',
      data: newVideo
    });
  } catch (error) {
    console.error('Add video error:', error);
    res.status(500).json({ success: false, message: 'Error adding video link' });
  }
});

// Delete video
router.delete('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    
    // Delete file from disk if it's a file upload
    if (video.type === 'file' && video.videoUrl) {
      const filePath = path.join(__dirname, '../', video.videoUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Video file deleted:', filePath);
      }
    }
    
    await Video.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: 'Error deleting video' });
  }
});

module.exports = router;