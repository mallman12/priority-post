// src/pages/HowItWorks.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function HowItWorks() {
  return (
    <main>
	<div className="card" style={{ maxWidth: '800px', margin: '2rem auto', textAlign: 'left' }}>
        <h2>What is Priority Post</h2>
        <p style={{ lineHeight: '1.6' }}>
          Sending an email is essentially free, but reading emails takes up valuable time. Priority Post is a simple system that allows senders to demonstrate that their messages were worth effort to send, and so worth effort to read. This is all done just through our web page, no downloads or access to your email account required.
        </p>
        <h3>Sending Emails</h3>
        <p style={{ lineHeight: '1.6' }}>
          Once you are signed up, you can log in and send emails to any other registered address. These emails will include your name and email address but will come from our official address (mail@prioritypost.net), so the receiveer knows it was sent through Priority Post. Coming soon, receivers can require senders to pay a fee.
        </p>
        <h3>Receiving Emails</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>
          What you do with emails sent from Priority Post of course is entirely up to you. If you want to make sure that you don't accidentally miss any, you can create a custom filter in your email client so that emails from mail@prioritypost.net are sorted into a priority folder or given a priority label.
        </p>
      </div>
    </main>
  );
}

export default HowItWorks;