import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

function Confirmed() {
  const [message, setMessage] = useState('Thank you for verifying your email address.');
  const location = useLocation();
  const emailSentRef = useRef(false); // Add a ref to track if the email has been sent

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const to_email = params.get('to_email');

    // Check if there is a 'to_email' in the URL and if our ref flag is false
    if (to_email && emailSentRef.current === false) {
      // Set the ref to true immediately to prevent this block from running again
      emailSentRef.current = true;

      setMessage('Processing your paid email...');
      const emailData = {
        to_email: to_email,
        from_email: params.get('from_email'),
        from_name: params.get('from_name'),
        subject: params.get('subject'),
        message: params.get('message'),
      };

      axios.post('/.netlify/functions/send-verified-email', emailData)
        .then(response => {
          setMessage('Your paid email has been sent successfully!');
        })
        .catch(error => {
          setMessage('There was an error sending your email. Please contact support.');
        });
    }
  }, [location]); // The dependency array is correct

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Email confirmed for Priority Post</h2>
      <p>{message}</p>
      <Link to="/">Go to Homepage</Link>
    </div>
  );
}

export default Confirmed;