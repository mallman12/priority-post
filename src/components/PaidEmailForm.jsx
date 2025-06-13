// src/components/PaidEmailForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import the auth hook

function PaidEmailForm() {
  const { user } = useAuth(); // Get the currently logged-in user

  const [formData, setFormData] = useState({
    to_email: '',
    from_name: '',
    from_email: '', // This will be set automatically
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // This effect runs when the component loads or when the user changes
  useEffect(() => {
    if (user) {
      // If a user is logged in, set their email in the form data
      setFormData(prevData => ({ ...prevData, from_email: user.email }));
    }
  }, [user]); // The dependency array ensures this runs when the user object changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting this data from the frontend:", formData);

    setIsLoading(true);
    setStatusMessage('Sending...');
    try {
      const response = await axios.post('/.netlify/functions/send-verified-email', formData);
      setStatusMessage(response.data.message);
      // Reset form, but keep the from_email field
      setFormData({ to_email: '', from_name: '', from_email: user.email, subject: '', message: '' });
    } catch (error) {
      const message = error.response ? error.response.data.message : 'A critical error occurred.';
      setStatusMessage(`Error: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="to_email" value={formData.to_email} onChange={handleInputChange} placeholder="Recipient's Email" required />
      <input type="text" name="from_name" value={formData.from_name} onChange={handleInputChange} placeholder="Your Name" required />
      
      {/* This field is now disabled because it's automatically filled */}
      <input type="email" name="from_email" value={formData.from_email} placeholder="Your Email" required readOnly disabled />
      
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