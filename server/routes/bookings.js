const express = require('express');
const router = express.Router();
const db = require('../database');

// Create new booking
router.post('/', async (req, res) => {
  try {
    const bookingData = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email || '',
      eventType: req.body.eventType,
      eventDate: req.body.eventDate,
      eventLocation: req.body.eventLocation,
      guestCount: req.body.guestCount || '',
      budget: req.body.budget || '',
      message: req.body.message || ''
    };
    
    const newBooking = db.createBooking(bookingData);
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully! We will contact you within 24 hours.',
      data: newBooking
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking. Please try again.',
      error: error.message
    });
  }
});

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = db.getBookings();
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

// Get single booking
router.get('/:id', async (req, res) => {
  try {
    const booking = db.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking'
    });
  }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedBooking = db.updateBookingStatus(req.params.id, status);
    
    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      data: updatedBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating booking'
    });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const deleted = db.deleteBooking(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting booking'
    });
  }
});

module.exports = router;