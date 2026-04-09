const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const Booking = require('./models/Booking');
const Package = require('./models/Package');
const Gallery = require('./models/Gallery');
const Video = require('./models/Video');

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Read JSON data
    const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
    
    // Migrate bookings
    if (data.bookings && data.bookings.length) {
      await Booking.insertMany(data.bookings);
      console.log(`Migrated ${data.bookings.length} bookings`);
    }
    
    // Migrate packages
    if (data.packages && data.packages.length) {
      await Package.insertMany(data.packages);
      console.log(`Migrated ${data.packages.length} packages`);
    }
    
    // Migrate gallery
    if (data.gallery && data.gallery.length) {
      await Gallery.insertMany(data.gallery);
      console.log(`Migrated ${data.gallery.length} gallery images`);
    }
    
    // Migrate videos
    if (data.videos && data.videos.length) {
      await Video.insertMany(data.videos);
      console.log(`Migrated ${data.videos.length} videos`);
    }
    
    console.log('Migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrate();