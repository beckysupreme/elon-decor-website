const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  eventType: { type: String, required: true },
  eventDate: { type: Date, required: true },
  eventLocation: { type: String, required: true },
  guestCount: { type: String, default: '' },
  budget: { type: String, default: '' },
  message: { type: String, default: '' },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// Use the existing 'bookings' collection or let MongoDB create it
module.exports = mongoose.model('Booking', bookingSchema);