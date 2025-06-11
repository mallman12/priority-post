// src/components/SignupForm.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Import our new Supabase client

function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Use the built-in Supabase auth function to sign up
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        // If Supabase returns an error, display it
        throw error;
      }
      
      // Check if a new user was created but needs confirmation
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setMessage("This email address is already registered. Please try logging in.");
      } else if (data.session === null && data.user) {
        setMessage("Success! Please check your email for a confirmation link.");
      } else {
        // Handle other cases if necessary
        setMessage("An unexpected event occurred. Please try again.");
      }
      
      // Clear form on success
      setEmail('');
      setPassword('');

    } catch (error) {
      // Set a user-friendly error message
      setMessage(`Error: ${error.error_description || error.message}`);
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
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Create a password"
        required
        // It's good practice to set a minimum password length
        minLength="6" 
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing Up...' : 'Sign Up'}
      </button>
      {message && <p className="message">{message}</p>}
    </form>
  );
}

export default SignupForm;