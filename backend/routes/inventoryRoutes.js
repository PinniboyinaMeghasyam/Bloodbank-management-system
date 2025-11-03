const express = require('express');
const Donor = require('../models/Donor');
const Inventory = require('../models/Inventory');
const router = express.Router();

// GET inventory - now requires database connection
router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: 'Error fetching inventory: ' + error.message });
  }
});

// GET top donors
router.get('/top-donors', async (req, res) => {
  try {
    // Aggregate donations by donor
    const topDonors = await Inventory.aggregate([
      { $unwind: '$donations' },
      {
        $group: {
          _id: '$donations.donorId',
          donorName: { $first: '$donations.donorName' },
          totalDonations: { $sum: '$donations.quantity' },
          donationCount: { $sum: 1 }
        }
      },
      { $sort: { totalDonations: -1 } },
      { $limit: 10 }
    ]);
    
    res.json(topDonors);
  } catch (error) {
    console.error('Error fetching top donors:', error);
    res.status(500).json({ message: 'Error fetching top donors: ' + error.message });
  }
});

// POST donation - now requires database connection
router.post('/donate', async (req, res) => {
  try {
    const { donorId, quantity } = req.body;
    
    // Validate donor exists
    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    // Update or create inventory entry
    let inventoryItem = await Inventory.findOne({ bloodGroup: donor.bloodGroup });
    if (inventoryItem) {
      inventoryItem.quantity += quantity;
      // Add donation record
      inventoryItem.donations.push({
        donorId: donor._id,
        donorName: donor.name,
        quantity: quantity
      });
      await inventoryItem.save();
    } else {
      // Create new inventory item with donation record
      inventoryItem = await Inventory.create({
        bloodGroup: donor.bloodGroup,
        quantity: quantity,
        donations: [{
          donorId: donor._id,
          donorName: donor.name,
          quantity: quantity
        }]
      });
    }

    res.status(200).json({ 
      message: `Successfully added ${quantity} units of ${donor.bloodGroup} blood` 
    });
  } catch (error) {
    console.error('Error adding donation:', error);
    res.status(500).json({ message: 'Error adding donation: ' + error.message });
  }
});

module.exports = router;