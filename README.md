# Blood Bank Management System - MERN Stack

A full-stack Blood Bank Management System built with the MERN stack (MongoDB, Express.js, React, Node.js) and deployed on Render.

## Quick Start

For instructions on running this application locally, please refer to our [Local Setup Guide](QUICK_START.md).

For detailed setup instructions including deployment, continue reading below.

## Features

- Donor registration with name, blood group, and contact information
- Blood donation tracking
- Real-time inventory management
- Responsive design

## Project Structure

```
.
├── backend/
│   ├── models/
│   │   ├── Donor.js
│   │   └── Inventory.js
│   ├── routes/
│   │   ├── donorRoutes.js
│   │   └── inventoryRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── ...
│   ├── package.json
│   └── ...
├── render.yaml
└── README.md
```

## Setup Instructions

### Prerequisites

1. Node.js (v14 or higher)
2. MongoDB Atlas account
3. Render account

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd blood-bank-management
   ```

2. Backend setup:
   ```bash
   cd backend
   npm install
   ```
   
3. Create a `.env` file in the backend directory with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/bloodbank?retryWrites=true&w=majority
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

5. Frontend setup (in a new terminal):
   ```bash
   cd frontend
   npm install
   npm start
   ```

### Deployment on Render

1. Fork this repository to your GitHub account
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set the following environment variables in Render:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: production
5. Add the following build command:
   ```
   cd backend && npm install
   ```
6. Add the following start command:
   ```
   cd backend && npm start
   ```
7. For the frontend, create another Web Service with:
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/build`

## API Endpoints

### Donors
- `GET /api/donors` - Get all donors
- `POST /api/donors` - Register a new donor

### Inventory
- `GET /api/inventory` - Get current blood inventory
- `POST /api/inventory/donate` - Add a blood donation

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Add your IP address to the whitelist (or allow access from anywhere for development)
5. Get the connection string and replace the username, password, and cluster details in the `.env` file

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Commit your changes
5. Push to the branch
6. Create a pull request

## License

This project is licensed under the MIT License.