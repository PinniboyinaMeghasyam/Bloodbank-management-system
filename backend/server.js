const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'URI is set' : 'URI is NOT set');
    
    // Log the URI structure without exposing credentials
    if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'your_mongodb_atlas_connection_string_here') {
      const uriParts = process.env.MONGODB_URI.split('@');
      if (uriParts.length > 1) {
        const userPart = uriParts[0].split('://')[1];
        const hostPart = uriParts[1].split('/')[0];
        console.log('MongoDB User:', userPart.split(':')[0]);
        console.log('MongoDB Host:', hostPart);
        console.log('MongoDB Database:', process.env.MONGODB_URI.split('/').pop().split('?')[0]);
      }
    }
    
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI === 'your_mongodb_atlas_connection_string_here') {
      throw new Error('MONGODB_URI is not defined in environment variables. Please set your MongoDB Atlas connection string in the .env file.');
    }
    
    // Add connection options for better reliability
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };
    
    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('MongoDB Atlas connection error:', error);
    console.log('Server cannot start without database connection. Exiting...');
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Blood Bank Management System API' });
});

// For any request that doesn't match the API routes, send the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;