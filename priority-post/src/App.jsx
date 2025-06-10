// src/App.jsx (Simplified for free version)
import React from 'react';
import SignupForm from './components/SignupForm';
import PaidEmailForm from './components/PaidEmailForm'; // Renamed for clarity, or just keep the old name
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Emailing Service</h1>
      </header>
      <main>
        <section className="card">
          <h2>Join Our Platform</h2>
          <p>Sign up to be available for contact.</p>
          <SignupForm />
        </section>
        <section className="card">
          <h2>Send an Email</h2>
          <p>Contact one of our registered users directly.</p>
          {/* No Stripe wrapper needed! */}
          <PaidEmailForm />
        </section>
      </main>
    </div>
  );
}

export default App;