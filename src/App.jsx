// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Import our new auth hook
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import PaidEmailForm from './components/PaidEmailForm';
import './App.css';
import logo from './assets/mail-logo.svg';

// The Navbar component will show the user's status and login/logout links
function Navbar() {
  const { session, signOut } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <img src={logo} className="App-logo" alt="Priority Post Logo" />
        <h1>Priority Post</h1>
      </Link>
      <div className="nav-links">
        {session ? (
          <>
            <span>{session.user.email}</span>
            <button onClick={signOut} className="nav-button">Log Out</button>
          </>
        ) : (
          <Link to="/login">Login / Sign Up</Link>
        )}
      </div>
    </nav>
  );
}

// This is the new, correct version
function AuthPage() {
  const { session } = useAuth(); // Get the current session state from our context

  // If a session exists, the user is logged in.
  // We immediately redirect them away from the login page to the homepage.
  if (session) {
    return <Navigate to="/" replace />;
  }
  
  // If there's no session, we show the login and signup forms as usual.
  return (
    <main>
      <section className="card">
        <h2>Sign Up</h2>
        <p>Create a new account to get started.</p>
        <SignupForm />
      </section>
      <section className="card">
        <h2>Log In</h2>
        <p>Access your existing account.</p>
        <LoginForm />
      </section>
    </main>
  );
}

// The component for sending emails, now protected
function SendEmailPage() {
  const { session } = useAuth();

  // If there's no session, redirect to the login page
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  // If there is a session, show the email form
  return (
    <main>
       <section className="card">
        <h2>Send an Email</h2>
        <p>Contact one of our registered users.</p>
        <PaidEmailForm />
      </section>
    </main>
  );
}


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<SendEmailPage />} />
          <Route path="/login" element={<AuthPage />} />
          {/* You can add your /confirmed route here if you still need it */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;