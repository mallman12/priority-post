// src/App.jsx (Simplified for free version)
import React from 'react';
import SignupForm from './components/SignupForm';
import PaidEmailForm from './components/PaidEmailForm'; // Renamed for clarity, or just keep the old name
import './App.css';
import logo from './assets/mail-logo.svg';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="Priority Post Logo" />
        <h1>Priority Post</h1>
      </header>
      <main>
        <section className="card">
          <h2>Sign up to be available for contact through Priority Post</h2>
          <p>Help people dedicated to contacting you stand out from the crowd</p>
          <SignupForm />
        </section>
        <section className="card">
          <h2>Send an email to a registered address</h2>
          {/* No Stripe wrapper needed! */}
          <PaidEmailForm />
        </section>
      </main>
    </div>
  );
}

export default App;