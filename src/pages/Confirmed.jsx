// src/pages/Confirmed.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for internal navigation

function Confirmed() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Email confirmed for Priority Post</h2>
      <p>Thank you for verifying your email address.</p>
      <Link to="/">Go to Homepage</Link>
    </div>
  );
}

export default Confirmed;