const express = require('express');
const Donor = require('../models/Donor');
const router = express.Router();

// GET all donors - now requires database connection
router.get('/', async (req, res) => {
  try {
    const donors = await Donor.find();
    res.json(donors);
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).json({ message: 'Error fetching donors: ' + error.message });
  }
});

// POST a new donor - now requires database connection
router.post('/', async (req, res) => {
  try {
    const { name, bloodGroup, contact } = req.body;
    
    const donor = new Donor({ name, bloodGroup, contact });
    const savedDonor = await donor.save();
    res.status(201).json(savedDonor);
  } catch (error) {
    console.error('Error registering donor:', error);
    res.status(500).json({ message: 'Error registering donor: ' + error.message });
  }
});

module.exports = router;