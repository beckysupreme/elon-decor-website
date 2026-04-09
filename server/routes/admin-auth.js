const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_this_in_production';

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Check if admin exists (for first time setup)
router.get('/setup-required', async (req, res) => {
  try {
    const setupRequired = !db.isAdminSetup();
    res.json({ success: true, setupRequired });
  } catch (error) {
    res.json({ success: true, setupRequired: true });
  }
});

// Create first admin account (setup)
router.post('/setup', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if admin already exists
    if (db.isAdminSetup()) {
      return res.status(403).json({ success: false, message: 'Admin already exists' });
    }
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    
    const admin = await db.createAdmin(username, password);
    
    res.json({ success: true, message: 'Admin account created successfully' });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error creating admin' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const isValid = await db.verifyAdmin(username, password);
    
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const admin = db.getAdmin();
    const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({
      success: true,
      token,
      admin: { username: admin.username }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Verify token route
router.get('/verify', verifyToken, (req, res) => {
  res.json({ success: true, message: 'Token is valid' });
});

// Change password route
router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = db.getAdmin();
    
    if (!admin || admin.id !== req.adminId) {
      return res.status(401).json({ success: false, message: 'Admin not found' });
    }
    
    const isValid = await db.verifyAdmin(admin.username, currentPassword);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    
    await db.updateAdminPassword(req.adminId, newPassword);
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error changing password' });
  }
});

// Logout (client side just removes token)
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = { router, verifyToken };