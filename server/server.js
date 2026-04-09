const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true ,limit: '50mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Import routes
const bookingRoutes = require('./routes/bookings-mongo');
const galleryRoutes = require('./routes/gallery-mongo');
const videoRoutes = require('./routes/videos-mongo');
const packageRoutes = require('./routes/packages-mongo');
const adminAuth = require('./routes/admin-auth-mongo');

// Use routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/admin-auth', adminAuth.router);

// Search endpoint
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }
    
    const Booking = require('./models/Booking');
    const Gallery = require('./models/Gallery');
    const Video = require('./models/Video');
    const Package = require('./models/Package');
    
    const searchTerm = q.toLowerCase();
    
    const [bookings, images, videos, packages] = await Promise.all([
      Booking.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { phone: { $regex: searchTerm, $options: 'i' } }
        ]
      }),
      Gallery.find({
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } }
        ]
      }),
      Video.find({
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } }
        ]
      }),
      Package.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { price: { $regex: searchTerm, $options: 'i' } }
        ]
      })
    ]);
    
    res.json({
      success: true,
      data: { bookings, images, videos, packages }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, message: 'Error performing search' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    databaseName: mongoose.connection.db?.databaseName
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});