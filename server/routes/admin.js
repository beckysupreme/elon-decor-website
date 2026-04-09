const express = require('express');
const router = express.Router();
const db = require('../database');

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const bookings = db.getBookings();
    const gallery = db.getGalleryImages();
    
    const stats = {
      totalBookings: bookings.length,
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
      completedBookings: bookings.filter(b => b.status === 'confirmed').length,
      totalGalleryImages: gallery.length,
      recentBookings: bookings.slice(0, 5)
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats'
    });
  }
});

// Get all bookings (with optional status filter)
router.get('/bookings', async (req, res) => {
  try {
    const status = req.query.status;
    let bookings = db.getBookings();
    
    if (status) {
      bookings = bookings.filter(b => b.status === status);
    }
    
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
});

// Get all gallery images
router.get('/gallery', async (req, res) => {
  try {
    const images = db.getGalleryImages();
    res.json({
      success: true,
      data: images
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery'
    });
  }
});

module.exports = router;