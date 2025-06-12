// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Logged in successfully! Redirecting...');
      // In a real app, you'd redirect here, but onAuthStateChange will handle it.
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging In...' : 'Log In'}
      </button>
      {message && <p className="message">{message}</p>}
    </form>
  );
}

export default LoginForm;