import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import PaidEmailForm from './components/PaidEmailForm';
import Confirmed from './pages/Confirmed';
import HowItWorks from './pages/HowItWorks';
import './App.css';
import logo from './assets/mail-logo.svg';
import StripeFeeSetup from './components/StripeFeeSetup';

function Navbar() {
  const { session, signOut } = useAuth();
  const location = useLocation();

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
            {location.pathname === '/how-it-works' || location.pathname === '/settings' ? (
              <Link to="/" className="back-to-app-link">← Back to Main Page</Link>
            ) : null}
            <button onClick={signOut} className="nav-button">Log Out</button>
          </>
        ) : (
          location.pathname !== '/login' && <Link to="/login">Login / Sign Up</Link>
        )}
      </div>
    </nav>
  );
}

// --- APP LAYOUT COMPONENT (This is the new part) ---
// This component contains our main layout and can use hooks like useLocation.
function AppLayout() {
  const location = useLocation();

  return (
    <div className="App">
      <Navbar />

      {/* --- CONDITIONAL SUB-HEADER --- */}
      {/* We now show both links here, but only on the main page */}
      {location.pathname === '/' && (
        <div className="sub-header">
          <Link to="/how-it-works" className="sub-header-link">How it Works</Link>
          <Link to="/settings" className="sub-header-link">Settings</Link>
        </div>
      )}

      {/* --- PAGE CONTENT --- */}
      <Routes>
        <Route path="/" element={<SendEmailPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/confirmed" element={<Confirmed />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/settings" element={<StripeFeeSetup />} />
      </Routes>
    </div>
  );
}

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
        <PaidEmailForm />
      </section>
    </main>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;