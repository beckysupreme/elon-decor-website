const express = require('express');
const router = express.Router();
const db = require('../database');
const { uploadVideo, cloudinary } = require('../config/cloudinary');

// Get all videos or filter by category
router.get('/', async (req, res) => {
  try {
    const category = req.query.category || 'all';
    const videos = db.getVideosByCategory(category);
    res.json({
      success: true,
      data: videos,
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching videos',
    });
  }
});

// Upload video file
router.post('/upload', uploadVideo.single('video'), async (req, res) => {
  try {
    const { title, category, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video file uploaded',
      });
    }

    const newVideo = db.addVideo({
      title: title || 'Untitled',
      category: category || 'other',
      description: description || '',
      videoUrl: req.file.path,
      publicId: req.file.filename,
      type: 'file'
    });

    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      data: newVideo,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading video',
    });
  }
});

// Add YouTube/Vimeo link
router.post('/link', async (req, res) => {
  try {
    const { title, category, videoUrl, description, thumbnail } = req.body;
    
    if (!title || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title and video URL are required',
      });
    }

    const newVideo = db.addVideo({
      title,
      category: category || 'other',
      videoUrl,
      description: description || '',
      thumbnail: thumbnail || '',
      type: 'link'
    });

    res.status(201).json({
      success: true,
      message: 'Video link added successfully',
      data: newVideo,
    });
  } catch (error) {
    console.error('Add video error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding video',
    });
  }
});

// Delete video
router.delete('/:id', async (req, res) => {
  try {
    const videos = db.getVideos();
    const video = videos.find(v => v.id === req.params.id);
    
    if (video && video.publicId) {
      await cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' });
    }
    
    const deleted = db.deleteVideo(req.params.id);
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Video deleted successfully',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting video',
    });
  }
});

module.exports = router;