// src/components/PaidEmailForm.jsx
// The final, secure version of the component.

import React, { useState } from 'react';
import axios from 'axios';

function PaidEmailForm() {
  const [formData, setFormData] = useState({
    to_email: '', from_name: '', from_email: '', subject: '', message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage('Sending...');

    try {
      const response = await axios.post('/.netlify/functions/send-verified-email', formData);
      setStatusMessage(response.data.message);
      setFormData({
        to_email: '', from_name: '', from_email: '', subject: '', message: '',
      });
    } catch (error) {
  // Log the full error response so we can see what we're working with
  console.error("An error was caught:", error.response);

  let errorMessage = 'An unknown error occurred.';

  // Check if a response and data from the server exist
  if (error.response && error.response.data) {
    let responseData = error.response.data;

    // If the data is a string, it needs to be parsed into an object first
    if (typeof responseData === 'string') {
      try {
        responseData = JSON.parse(responseData);
      } catch (parseError) {
        // If parsing fails, the string itself is likely the error message
        console.error("Failed to parse error response JSON:", parseError);
        errorMessage = responseData;
      }
    }

    // Now that we're sure responseData is an object, we can get the message
    errorMessage = responseData.message || 'The server returned an error with no message.';
  }

  setStatusMessage(`${errorMessage}`);
} finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="to_email" value={formData.to_email} onChange={handleInputChange} placeholder="Recipient's Email" required />
      <input type="text" name="from_name" value={formData.from_name} onChange={handleInputChange} placeholder="Your Name" required />
      <input type="email" name="from_email" value={formData.from_email} onChange={handleInputChange} placeholder="Your Email" required />
      <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Subject" required />
      <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Your Message" required rows={6} />
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Verified Email'}
      </button>

      {statusMessage && <p className="message">{statusMessage}</p>}
    </form>
  );
}

export default PaidEmailForm;