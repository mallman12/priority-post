// src/components/SignupForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

function SignupForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!email) {
      setMessage('Please enter a valid email.');
      setIsLoading(false);
      return;
    }

    try {
      // The endpoint for your Netlify Function
      const response = await axios.post('/.netlify/functions/signup', { email });
      setMessage(response.data.message);
      setEmail(''); // Clear the input on success
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'An error occurred.';
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your-email@example.com"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing Up...' : 'Sign Up'}
      </button>
      {message && <p className="message">{message}</p>}
    </form>
  );
}

export default SignupForm;