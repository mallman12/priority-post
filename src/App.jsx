// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import PaidEmailForm from './components/PaidEmailForm';
import Confirmed from './pages/Confirmed'; // Import your new page
import './App.css';
import logo from './assets/mail-logo.svg';

// A new component for your main homepage content
function HomePage() {
  return (
    <main>
      <section className="card">
        <h2>Join Our Platform</h2>
        <p>Sign up with your email to receive paid messages.</p>
        <SignupForm />
      </section>
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
    // The Router component wraps your entire application
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="Priority Post Logo" />
          <h1>Priority Post</h1>
        </header>
        
        {/* The Routes component switches between your pages */}
        <Routes>
          {/* Route for your homepage */}
          <Route path="/" element={<HomePage />} />
          
          {/* Route for your new confirmation page */}
          <Route path="/confirmed" element={<Confirmed />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;