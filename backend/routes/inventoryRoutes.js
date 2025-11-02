const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Donor = require('../models/Donor');

// Initialize inventory with all blood groups (run once)
let inventoryInitialized = false;
const initializeInventory = async () => {
  if (inventoryInitialized) return;
  
  try {
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    
    for (const group of bloodGroups) {
      const existing = await Inventory.findOne({ bloodGroup: group });
      if (!existing) {
        await Inventory.create({ bloodGroup: group, quantity: 0 });
      }
    }
    
    inventoryInitialized = true;
    console.log('Inventory initialized successfully');
  } catch (error) {
    console.error('Error initializing inventory:', error);
  }
};

// Get current inventory
router.get('/', async (req, res) => {
  try {
    await initializeInventory();
    const inventory = await Inventory.find().sort({ bloodGroup: 1 });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add blood donation
router.post('/donate', async (req, res) => {
  try {
    const { donorId, quantity } = req.body;
    
    // Validate donor
    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    
    // Update inventory
    const inventory = await Inventory.findOneAndUpdate(
      { bloodGroup: donor.bloodGroup },
      { $inc: { quantity: quantity } },
      { new: true, upsert: true }
    );
    
    res.json({
      message: `Added ${quantity} unit(s) of ${donor.bloodGroup} blood to inventory.`,
      inventory
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;