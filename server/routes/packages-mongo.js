const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Package = require('../models/Package');

// Get all packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });
    res.json({ success: true, data: packages });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ success: false, message: 'Error fetching packages' });
  }
});

// Add package
router.post('/', async (req, res) => {
  try {
    const newPackage = new Package(req.body);
    await newPackage.save();
    res.status(201).json({ success: true, message: 'Package added successfully', data: newPackage });
  } catch (error) {
    console.error('Error adding package:', error);
    res.status(500).json({ success: false, message: 'Error adding package' });
  }
});

// Update package
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid package ID format' });
    }
    
    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedPackage) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    
    res.json({ success: true, data: updatedPackage });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ success: false, message: 'Error updating package' });
  }
});

// Delete package - FIXED
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to delete package with ID:', id);
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid package ID format' });
    }
    
    const deletedPackage = await Package.findByIdAndDelete(id);
    
    if (!deletedPackage) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    
    console.log('Package deleted successfully:', deletedPackage._id);
    res.json({ success: true, message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({ success: false, message: 'Error deleting package: ' + error.message });
  }
});

module.exports = router;