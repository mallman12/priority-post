import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function PaidEmailForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    to_email: '',
    from_name: '',
    from_email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  // New state to hold the fee/status of the recipient
  const [recipientStatus, setRecipientStatus] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prevData => ({ ...prevData, from_email: user.email }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  // This new function checks the recipient's status onBlur
  const handleRecipientCheck = async () => {
    if (!formData.to_email) {
      setRecipientStatus('');
      return;
    }

    setRecipientStatus('Checking...');
    const { data: recipient, error } = await supabase
      .from('profiles')
      .select('fee')
      .eq('email', formData.to_email)
      .single();

    if (error || !recipient) {
      setRecipientStatus('This email address is not registered with Priority Post.');
    } else {
      const fee = Number(recipient.fee);
      if (fee > 0) {
        setRecipientStatus(`Fee: $${fee.toFixed(2)}`);
      } else {
        setRecipientStatus('This user can be emailed for free.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage('Checking recipient...');

    try {
      const { data: recipient, error: recipientError } = await supabase
        .from('profiles')
        .select('fee')
        .eq('email', formData.to_email)
        .single();

      if (recipientError || !recipient) {
        setStatusMessage('Error: Could not find recipient.');
        setRecipientStatus('This email address is not registered with Priority Post.');
        setIsLoading(false);
        return;
      }

      if (recipient.fee > 0) {
        setStatusMessage('Redirecting to payment...');
        const response = await axios.post('/.netlify/functions/create-checkout-session', {
          amount: recipient.fee,
          recipientEmail: formData.to_email,
          fromEmail: formData.from_email,
          fromName: formData.from_name,
          subject: formData.subject,
          message: formData.message,
        });

        const session = response.data;
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: session.id,
        });

        if (error) {
          setStatusMessage(`Error: ${error.message}`);
        }
      } else {
        const response = await axios.post('/.netlify/functions/send-verified-email', formData);
        setStatusMessage(response.data.message);
        setFormData({ to_email: '', from_name: '', from_email: user.email, subject: '', message: '' });
        setRecipientStatus(''); // Clear the status message on success
      }
    } catch (error) {
      const message = error.response ? error.response.data.message : 'A critical error occurred.';
      setStatusMessage(`Error: ${message}`);
    } finally {
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
        onBlur={handleRecipientCheck} // Add the onBlur event handler here
        placeholder="Recipient's Email"
        required
      />
      {/* Add this line to display the recipient's status */}
      {recipientStatus && <p className="recipient-status">{recipientStatus}</p>}

      <input type="text" name="from_name" value={formData.from_name} onChange={handleInputChange} placeholder="Your Name" required />
      <input type="email" name="from_email" value={formData.from_email} placeholder="Your Email" required readOnly disabled />
      <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Subject" required />
      <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Your Message" required rows={6} />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Send Email'}
      </button>
      {statusMessage && <p className="message">{statusMessage}</p>}
    </form>
  );
}

export default PaidEmailForm;