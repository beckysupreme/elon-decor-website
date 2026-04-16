const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const allowedOrigins = [
  'https://elon-decor-website.vercel.app',
  'https://elon-decor.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

// Create uploads directory
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true ,limit: '200mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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