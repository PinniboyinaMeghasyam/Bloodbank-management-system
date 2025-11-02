const express = require('express');
const router = express.Router();
const Donor = require('../models/Donor');

// Get all donors
router.get('/', async (req, res) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 });
    res.json(donors);
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).json({ message: 'Failed to fetch donors' });
  }
});

// Register a new donor
router.post('/', async (req, res) => {
  try {
    const { name, bloodGroup, contact } = req.body;
    
    // Validate required fields
    if (!name || !bloodGroup || !contact) {
      return res.status(400).json({ 
        message: 'Name, blood group, and contact are required' 
      });
    }
    
    // Check if donor already exists
    const existingDonor = await Donor.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }, 
      bloodGroup 
    });
    
    if (existingDonor) {
      return res.status(400).json({ 
        message: `Donor ${name} with blood group ${bloodGroup} is already registered.` 
      });
    }
    
    const donor = new Donor({
      name,
      bloodGroup,
      contact
    });
    
    const newDonor = await donor.save();
    res.status(201).json(newDonor);
  } catch (error) {
    console.error('Error registering donor:', error);
    res.status(500).json({ message: 'Failed to register donor' });
  }
});

module.exports = router;