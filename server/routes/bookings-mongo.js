const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: 'Error fetching bookings' });
  }
});

// Create new booking
router.post('/', async (req, res) => {
  try {
    console.log('Received booking data:', req.body);
    
    const bookingData = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email || '',
      eventType: req.body.eventType,
      eventDate: req.body.eventDate,
      eventLocation: req.body.eventLocation,
      guestCount: req.body.guestCount || '',
      budget: req.body.budget || '',
      message: req.body.message || '',
      status: 'pending'
    };
    
    const booking = new Booking(bookingData);
    const savedBooking = await booking.save();
    
    console.log('Booking saved:', savedBooking);
    
    res.status(201).json({ 
      success: true, 
      message: 'Booking created successfully!', 
      data: savedBooking 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: 'Error creating booking', error: error.message });
  }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID format' });
    }
    
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    res.json({ success: true, data: booking });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ success: false, message: 'Error updating booking', error: error.message });
  }
});

// Delete booking - FIXED
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to delete booking with ID:', id);
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID format' });
    }
    
    const deletedBooking = await Booking.findByIdAndDelete(id);
    
    if (!deletedBooking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    console.log('Booking deleted successfully:', deletedBooking._id);
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ success: false, message: 'Error deleting booking: ' + error.message });
  }
});

module.exports = router;