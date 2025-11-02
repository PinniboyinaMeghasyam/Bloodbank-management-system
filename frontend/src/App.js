import React, { useState, useEffect } from 'react';
import './App.css';

// Get API base URL from environment variable or default to your backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://bloodbank-management-system-8qru.onrender.com';

function App() {
  const [donors, setDonors] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({
    donorName: '',
    donorBloodGroup: '',
    donorContact: '',
    donorSelect: '',
    donationQty: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch donors and inventory on component mount
  useEffect(() => {
    fetchDonors();
    fetchInventory();
  }, []);

  // Fetch all donors
  const fetchDonors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/donors`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDonors(data);
      setError('');
    } catch (error) {
      console.error('Error fetching donors:', error);
      setError('Failed to fetch donors. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch inventory
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/inventory`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setInventory(data);
      setError('');
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Failed to fetch inventory. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  // Register a new donor
  const handleDonorSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/donors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.donorName,
          bloodGroup: formData.donorBloodGroup,
          contact: formData.donorContact
        })
      });

      const result = await response.json();
      if (response.ok) {
        alert(`Donor ${formData.donorName} registered!`);
        // Reset form fields
        setFormData({
          ...formData,
          donorName: '',
          donorBloodGroup: '',
          donorContact: ''
        });
        // Refresh donor list
        await fetchDonors();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error registering donor:', error);
      alert('Error registering donor. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add blood donation
  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/inventory/donate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          donorId: formData.donorSelect,
          quantity: parseInt(formData.donationQty)
        })
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setFormData({
          ...formData,
          donorSelect: '',
          donationQty: ''
        });
        await fetchInventory();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error adding donation:', error);
      alert('Error adding donation. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Blood Bank Management System</h2>
      
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading...</div>}
      
      <h3>Register Donor</h3>
      <form id="donorForm" onSubmit={handleDonorSubmit}>
        <label htmlFor="donorName">Name:</label>
        <input 
          type="text" 
          id="donorName" 
          value={formData.donorName}
          onChange={handleInputChange}
          required 
          placeholder="e.g., John Doe" 
        />

        <label htmlFor="donorBloodGroup">Blood Group:</label>
        <select 
          id="donorBloodGroup" 
          value={formData.donorBloodGroup}
          onChange={handleInputChange}
          required
        >
          <option value="">Select a blood group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
        
        <label htmlFor="donorContact">Contact:</label>
        <input 
          type="text" 
          id="donorContact" 
          value={formData.donorContact}
          onChange={handleInputChange}
          required 
          placeholder="e.g., 555-1234"
        />
        
        <button type="submit" disabled={loading}>Register Donor</button>
      </form>

      <h3>Add Blood Donation</h3>
      <form id="donationForm" onSubmit={handleDonationSubmit}>
        <label htmlFor="donorSelect">Donor Name:</label>
        <select 
          id="donorSelect" 
          value={formData.donorSelect}
          onChange={handleInputChange}
          required
        >
          <option value="">Select donor</option>
          {donors.map((donor) => (
            <option key={donor._id} value={donor._id}>
              {donor.name} ({donor.bloodGroup})
            </option>
          ))}
        </select>
        
        <label htmlFor="donationQty">Quantity (units):</label>
        <input 
          type="number" 
          id="donationQty" 
          value={formData.donationQty}
          onChange={handleInputChange}
          min="1" 
          required 
          placeholder="e.g., 1"
        />
        
        <button type="submit" disabled={loading}>Add Donation</button>
      </form>

      <h3>Current Blood Inventory</h3>
      <table>
        <thead>
          <tr>
            <th>Blood Group</th>
            <th>Quantity (units)</th>
          </tr>
        </thead>
        <tbody id="inventoryTableBody">
          {inventory.map((item) => (
            <tr key={item.bloodGroup}>
              <td>{item.bloodGroup}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
