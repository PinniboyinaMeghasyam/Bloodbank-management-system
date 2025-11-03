import React, { useState, useEffect } from 'react';

const TopDonors = ({ authToken }) => {
  const [topDonors, setTopDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTopDonors();
  }, []);

  const fetchTopDonors = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8003/api/inventory/top-donors', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTopDonors(data);
      setError('');
    } catch (error) {
      console.error('Error fetching top donors:', error);
      setError('Failed to fetch top donors. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading top donors...</div>;
  }

  return (
    <div className="top-donors">
      <h3>Top Blood Donors</h3>
      {error && <div className="error-message">{error}</div>}
      {topDonors.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Donor Name</th>
              <th>Total Units Donated</th>
              <th>Number of Donations</th>
            </tr>
          </thead>
          <tbody>
            {topDonors.map((donor, index) => (
              <tr 
                key={donor._id} 
                className={index === 0 ? 'first-place' : index === 1 ? 'second-place' : index === 2 ? 'third-place' : ''}
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                <td>{index + 1}</td>
                <td>{donor.donorName}</td>
                <td>{donor.totalDonations}</td>
                <td>{donor.donationCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No donation records found.</p>
      )}
    </div>
  );
};

export default TopDonors;