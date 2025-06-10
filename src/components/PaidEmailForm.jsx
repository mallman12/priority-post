// src/components/PaidEmailForm.jsx (Simplified for free version)
import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

function PaidEmailForm() {
  // The form state remains the same
  const [formData, setFormData] = useState({
    to_email: '',
    from_name: '',
    from_email: '',
    subject: '',
    message: '',
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // The handleSubmit function is now much simpler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage('Sending email...');

    // These are your EmailJS credentials stored in .env.local
    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    try {
      // Directly call EmailJS
      await emailjs.send(serviceID, templateID, formData, publicKey);
      
      setStatusMessage('Email sent successfully!');
      setIsLoading(false);
      
      // Clear the form on success
      setFormData({ to_email: '', from_name: '', from_email: '', subject: '', message: '' });

    } catch (error) {
  // Log the entire error object to the browser console for inspection
  console.error("A detailed error occurred:", error);

  // Create a more informative message for the user
  let displayMessage = "An unknown error occurred. Please check the console for details.";

  // EmailJS errors often have a .text property
  if (error && error.text) {
    displayMessage = error.text;
  }

  setStatusMessage(`Error: ${displayMessage}`);
  setIsLoading(false);
}
  };

  return (
    // The form no longer contains the Stripe Card Element
    <form onSubmit={handleSubmit}>
      <input type="email" name="to_email" value={formData.to_email} onChange={handleInputChange} placeholder="Recipient's Email" required />
      <input type="text" name="from_name" value={formData.from_name} onChange={handleInputChange} placeholder="Your Name" required />
      <input type="email" name="from_email" value={formData.from_email} onChange={handleInputChange} placeholder="Your Email" required />
      <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Subject" required />
      <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Your Message" required />
      
      {/* The button text is simplified */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Email'}
      </button>
      {statusMessage && <p className="message">{statusMessage}</p>}
    </form>
  );
}

export default PaidEmailForm;