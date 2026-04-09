const ADMIN_CREDENTIALS = {
  username: 'admin',
  // Password is 'admin123' - CHANGE THIS!
  passwordHash: '$2a$10$YourHashedPasswordHere' // You'll need to generate this
};

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dataPath = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataPath)) {
  const initialData = {
    bookings: [],
    gallery: [],
    videos: [],
    packages: [
      {
        id: "1",
        name: "Basic",
        price: "15,000",
        features: [
          "Basic flower arrangements",
          "Standard balloon decorations",
          "Simple table centerpieces",
          "Basic lighting"
        ],
        popular: false,
        createdAt: new Date().toISOString()
      },
      {
        id: "2",
        name: "Standard",
        price: "30,000",
        features: [
          "Premium flower arrangements",
          "Balloon arches and columns",
          "Elegant table centerpieces",
          "Stage decoration",
          "LED lighting setup",
          "Photo backdrop"
        ],
        popular: true,
        createdAt: new Date().toISOString()
      },
      {
        id: "3",
        name: "Premium",
        price: "50,000",
        features: [
          "Luxury flower arrangements",
          "Custom balloon designs",
          "Premium table settings",
          "Full stage decoration",
          "Professional lighting",
          "Multiple photo spots",
          "Candle light setup",
          "Furniture arrangement"
        ],
        popular: false,
        createdAt: new Date().toISOString()
      }
    ]
  };
  fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2));
  console.log('✅ Database file created with default packages');
}

// Read data from JSON file
const readData = () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { bookings: [], gallery: [], videos: [], packages: [] };
  }
};

// Write data to JSON file
const writeData = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to database:', error);
    return false;
  }
};

// ========== PACKAGE FUNCTIONS ==========
const getPackages = () => {
  const data = readData();
  return data.packages || [];
};

const getPackageById = (id) => {
  const data = readData();
  return (data.packages || []).find(pkg => pkg.id === id);
};

const addPackage = (packageData) => {
  const data = readData();
  const newPackage = {
    id: Date.now().toString(),
    ...packageData,
    createdAt: new Date().toISOString()
  };
  if (!data.packages) data.packages = [];
  data.packages.push(newPackage);
  writeData(data);
  return newPackage;
};

const updatePackage = (id, updatedData) => {
  const data = readData();
  const packageIndex = (data.packages || []).findIndex(pkg => pkg.id === id);
  if (packageIndex !== -1) {
    data.packages[packageIndex] = {
      ...data.packages[packageIndex],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    writeData(data);
    return data.packages[packageIndex];
  }
  return null;
};

const deletePackage = (id) => {
  const data = readData();
  const filteredPackages = (data.packages || []).filter(pkg => pkg.id !== id);
  if (filteredPackages.length !== (data.packages || []).length) {
    data.packages = filteredPackages;
    writeData(data);
    return true;
  }
  return false;
};

// ========== BOOKING FUNCTIONS ==========
const getBookings = () => {
  const data = readData();
  return (data.bookings || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const getBookingById = (id) => {
  const data = readData();
  return (data.bookings || []).find(booking => booking.id === id);
};

const createBooking = (bookingData) => {
  const data = readData();
  const newBooking = {
    id: Date.now().toString(),
    ...bookingData,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  if (!data.bookings) data.bookings = [];
  data.bookings.push(newBooking);
  writeData(data);
  return newBooking;
};

const updateBookingStatus = (id, status) => {
  const data = readData();
  const bookingIndex = (data.bookings || []).findIndex(booking => booking.id === id);
  if (bookingIndex !== -1) {
    data.bookings[bookingIndex].status = status;
    writeData(data);
    return data.bookings[bookingIndex];
  }
  return null;
};

const deleteBooking = (id) => {
  const data = readData();
  const filteredBookings = (data.bookings || []).filter(booking => booking.id !== id);
  if (filteredBookings.length !== (data.bookings || []).length) {
    data.bookings = filteredBookings;
    writeData(data);
    return true;
  }
  return false;
};

// ========== GALLERY IMAGE FUNCTIONS ==========
const getGalleryImages = () => {
  const data = readData();
  return (data.gallery || []).sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
};

const getGalleryImagesByCategory = (category) => {
  const data = readData();
  const images = data.gallery || [];
  if (category === 'all') {
    return images;
  }
  return images.filter(image => image.category === category);
};

const addGalleryImage = (imageData) => {
  const data = readData();
  const newImage = {
    id: Date.now().toString(),
    ...imageData,
    type: 'image',
    uploadedAt: new Date().toISOString()
  };
  if (!data.gallery) data.gallery = [];
  data.gallery.push(newImage);
  writeData(data);
  return newImage;
};

const deleteGalleryImage = (id) => {
  const data = readData();
  const filteredImages = (data.gallery || []).filter(image => image.id !== id);
  if (filteredImages.length !== (data.gallery || []).length) {
    data.gallery = filteredImages;
    writeData(data);
    return true;
  }
  return false;
};

// ========== VIDEO FUNCTIONS ==========
const getVideos = () => {
  const data = readData();
  return (data.videos || []).sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
};

const getVideosByCategory = (category) => {
  const data = readData();
  const videos = data.videos || [];
  if (category === 'all') {
    return videos;
  }
  return videos.filter(video => video.category === category);
};

const addVideo = (videoData) => {
  const data = readData();
  const newVideo = {
    id: Date.now().toString(),
    ...videoData,
    type: videoData.type || 'link',
    uploadedAt: new Date().toISOString()
  };
  if (!data.videos) data.videos = [];
  data.videos.push(newVideo);
  writeData(data);
  return newVideo;
};

const deleteVideo = (id) => {
  const data = readData();
  const filteredVideos = (data.videos || []).filter(video => video.id !== id);
  if (filteredVideos.length !== (data.videos || []).length) {
    data.videos = filteredVideos;
    writeData(data);
    return true;
  }
  return false;
};

// ========== SEARCH FUNCTION ==========
const searchAll = (query) => {
  const data = readData();
  const searchTerm = query.toLowerCase();
  
  const searchResults = {
    bookings: (data.bookings || []).filter(booking => 
      booking.name?.toLowerCase().includes(searchTerm) ||
      booking.phone?.includes(searchTerm) ||
      booking.eventType?.toLowerCase().includes(searchTerm) ||
      booking.eventLocation?.toLowerCase().includes(searchTerm)
    ),
    images: (data.gallery || []).filter(image => 
      image.title?.toLowerCase().includes(searchTerm) ||
      image.description?.toLowerCase().includes(searchTerm) ||
      image.category?.toLowerCase().includes(searchTerm)
    ),
    videos: (data.videos || []).filter(video => 
      video.title?.toLowerCase().includes(searchTerm) ||
      video.description?.toLowerCase().includes(searchTerm) ||
      video.category?.toLowerCase().includes(searchTerm)
    ),
    packages: (data.packages || []).filter(pkg => 
      pkg.name?.toLowerCase().includes(searchTerm) ||
      pkg.price?.includes(searchTerm) ||
      pkg.features?.some(f => f.toLowerCase().includes(searchTerm))
    )
  };
  
  return searchResults;
};

const getAdmin = () => {
  const data = readData();
  return data.admin || null;
};

const createAdmin = async (username, password) => {
  const data = readData();
  
  // Check if admin already exists
  if (data.admin) {
    throw new Error('Admin already exists');
  }
  
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  data.admin = {
    id: Date.now().toString(),
    username: username,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
  
  writeData(data);
  return data.admin;
};

const verifyAdmin = async (username, password) => {
  const data = readData();
  const admin = data.admin;
  
  if (!admin) {
    return false;
  }
  
  if (admin.username !== username) {
    return false;
  }
  
  const isValid = await bcrypt.compare(password, admin.password);
  return isValid;
};

const updateAdminPassword = async (adminId, newPassword) => {
  const data = readData();
  const admin = data.admin;
  
  if (!admin || admin.id !== adminId) {
    return false;
  }
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  admin.password = hashedPassword;
  writeData(data);
  return true;
};

const isAdminSetup = () => {
  const data = readData();
  return !!data.admin;
};

module.exports = {
  // Package functions
  getPackages,
  getPackageById,
  addPackage,
  updatePackage,
  deletePackage,
  // Booking functions
  getBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking,
  // Gallery functions
  getGalleryImages,
  getGalleryImagesByCategory,
  addGalleryImage,
  deleteGalleryImage,
  // Video functions
  getVideos,
  getVideosByCategory,
  addVideo,
  deleteVideo,
  // Search function
  searchAll,
  getAdmin,
  createAdmin,
  verifyAdmin,
  updateAdminPassword,
  isAdminSetup
};