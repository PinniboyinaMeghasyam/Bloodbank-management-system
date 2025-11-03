import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={authToken ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/login" 
            element={<Login setAuthToken={setAuthToken} />} 
          />
          <Route 
            path="/register" 
            element={<Signup setAuthToken={setAuthToken} />} 
          />
          <Route 
            path="/dashboard" 
            element={<Dashboard authToken={authToken} setAuthToken={setAuthToken} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;