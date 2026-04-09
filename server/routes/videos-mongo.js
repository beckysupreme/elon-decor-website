const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Video = require('../models/Video');
const { uploadVideo, cloudinary } = require('../config/cloudinary');

// Get all videos
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    const videos = await Video.find(filter).sort({ uploadedAt: -1 });
    res.json({ success: true, data: videos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ success: false, message: 'Error fetching videos' });
  }
});

// Upload video file
router.post('/upload', uploadVideo.single('video'), async (req, res) => {
  try {
    console.log('Video upload request received');
    console.log('File:', req.file);
    console.log('Body:', req.body);
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No video file uploaded' });
    }
    
    const { title, category, description } = req.body;
    
    const newVideo = new Video({
      title: title || 'Untitled',
      category: category || 'other',
      description: description || '',
      videoUrl: req.file.path,
      publicId: req.file.filename,
      type: 'file'
    });
    
    await newVideo.save();
    
    console.log('Video saved:', newVideo);
    
    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      data: newVideo
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Error uploading video: ' + error.message });
  }
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

// Delete video - FIXED
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to delete video with ID:', id);
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid video ID format' });
    }
    
    const video = await Video.findById(id);
    
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    
    // Delete from Cloudinary if it's a file upload
    if (video.type === 'file' && video.publicId) {
      try {
        await cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' });
        console.log('Deleted from Cloudinary:', video.publicId);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
      }
    }
    
    const deletedVideo = await Video.findByIdAndDelete(id);
    console.log('Video deleted successfully:', deletedVideo._id);
    
    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: 'Error deleting video: ' + error.message });
  }
});

module.exports = router;