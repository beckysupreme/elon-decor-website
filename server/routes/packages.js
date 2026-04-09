const express = require('express');
const router = express.Router();
const db = require('../database');

// Get all packages
router.get('/', async (req, res) => {
  try {
    const packages = db.getPackages();
    res.json({
      success: true,
      data: packages,
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching packages',
    });
  }
});

// Get single package
router.get('/:id', async (req, res) => {
  try {
    const package = db.getPackageById(req.params.id);
    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found',
      });
    }
    res.json({
      success: true,
      data: package,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching package',
    });
  }
});

// Add new package
router.post('/', async (req, res) => {
  try {
    const { name, price, features, popular, description } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required',
      });
    }

    const newPackage = db.addPackage({
      name,
      price,
      features: features || [],
      popular: popular || false,
      description: description || '',
    });

    res.status(201).json({
      success: true,
      message: 'Package added successfully',
      data: newPackage,
    });
  } catch (error) {
    console.error('Add package error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding package',
    });
  }
});

// Update package
router.put('/:id', async (req, res) => {
  try {
    const { name, price, features, popular, description } = req.body;
    
    const updatedPackage = db.updatePackage(req.params.id, {
      name,
      price,
      features,
      popular,
      description,
    });
    
    if (!updatedPackage) {
      return res.status(404).json({
        success: false,
        message: 'Package not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Package updated successfully',
      data: updatedPackage,
    });
  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating package',
    });
  }
});

// Delete package
router.delete('/:id', async (req, res) => {
  try {
    const deleted = db.deletePackage(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Package not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Package deleted successfully',
    });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting package',
    });
  }
});

module.exports = router;