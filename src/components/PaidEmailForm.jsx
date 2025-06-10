// src/components/PaidEmailForm.jsx

import React, { useState } from 'react';
import axios from 'axios';

function PaidEmailForm() {
  // State to hold all the data from our form inputs
  const [formData, setFormData] = useState({
    to_email: '',
    from_name: '',
    from_email: '',
    subject: '',
    message: '',
  });

  // State to manage the loading status (to disable the button)
  const [isLoading, setIsLoading] = useState(false);

  // State to display success or error messages to the user
  const [statusMessage, setStatusMessage] = useState('');

  // A single handler to update our formData state as the user types
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * This function now sends the form data to our own secure Netlify Function
   * instead of calling EmailJS directly from the frontend.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setIsLoading(true);
    setStatusMessage('Verifying recipient and sending email...');

    try {
      // Send all the form data to our new backend endpoint
      const response = await axios.post('/.netlify/functions/send-verified-email', formData);

      // Set the success message from our function's response
      setStatusMessage(response.data.message);
      
      // Clear the form fields on successful submission
      setFormData({
        to_email: '',
        from_name: '',
        from_email: '',
        subject: '',
        message: '',
      });

    } catch (error) {
      // If our function returns an error, we display it to the user
      const message = error.response 
        ? error.response.data.message 
        : 'An unknown error occurred. Please try again.';
      setStatusMessage(`Error: ${message}`);
    } finally {
      // Re-enable the button regardless of success or failure
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="to_email"
        value={formData.to_email}
        onChange={handleInputChange}
        placeholder="Recipient's Email"
        required
      />
      <input
        type="text"
        name="from_name"
        value={formData.from_name}
        onChange={handleInputChange}
        placeholder="Your Name"
        required
      />
      <input
        type="email"
        name="from_email"
        value={formData.from_email}
        onChange={handleInputChange}
        placeholder="Your Email"
        required
      />
      <input
        type="text"
        name="subject"
        value={formData.subject}
        onChange={handleInputChange}
        placeholder="Subject"
        required
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleInputChange}
        placeholder="Your Message"
        required
        rows={6}
      />
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Verified Email'}
      </button>

      {/* Conditionally render the status message if it exists */}
      {statusMessage && <p className="message">{statusMessage}</p>}
    </form>
  );
}

export default PaidEmailForm;