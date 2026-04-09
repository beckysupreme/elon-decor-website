const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_this_in_production';

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

// Check if setup required
router.get('/setup-required', async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    res.json({ success: true, setupRequired: adminCount === 0 });
  } catch (error) {
    console.error('Error checking setup:', error);
    res.json({ success: true, setupRequired: true });
  }
});

// Setup first admin
router.post('/setup', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Setup attempt for username:', username);
    
    // Check if admin already exists
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(403).json({ success: false, message: 'Admin already exists' });
    }
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    
    // Create new admin
    const admin = new Admin({ username, password });
    await admin.save();
    
    console.log('Admin created successfully');
    
    res.json({ success: true, message: 'Admin account created successfully' });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ success: false, message: 'Error creating admin: ' + error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Login attempt for username:', username);
    
    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.log('Admin not found');
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Compare password
    const isValid = await admin.comparePassword(password);
    if (!isValid) {
      console.log('Invalid password');
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign({ adminId: admin._id }, JWT_SECRET, { expiresIn: '24h' });
    
    console.log('Login successful');
    
    res.json({ 
      success: true, 
      token, 
      admin: { username: admin.username } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed: ' + error.message });
  }
});

// Verify token
router.get('/verify', verifyToken, (req, res) => {
  res.json({ success: true, message: 'Token is valid' });
});

// Change password
router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const admin = await Admin.findById(req.adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    
    const isValid = await admin.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    
    admin.password = newPassword;
    await admin.save();
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Error changing password' });
  }
});

module.exports = { router, verifyToken };