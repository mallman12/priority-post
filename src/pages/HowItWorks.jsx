// src/pages/HowItWorks.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function HowItWorks() {
  return (
    <main>
	<div className="card" style={{ maxWidth: '800px', margin: '2rem auto', textAlign: 'left' }}>
        <h2>What is Priority Post?</h2>
        <p style={{ lineHeight: '1.6' }}>
          Priority Post is a simple system where users can pay a fee to email a registered address, and the recipient will see that the email came from Priority Post. This is all done just through our web page, no downloads or access to your email account required.
        </p>
        <h3>Why?</h3>
        <p style={{ lineHeight: '1.6' }}>
          Reading emails takes time, but it's usually not worth reading every single one we receive. Spam filters take care of emails that are obviously spam, but for the rest we have to rely on snap judgements of what's worth our time and what isn't. The problem is, how does someone with something important to bring to your attention stand out from the crowd?
        </p>
        <h3>Sending Emails</h3>
        <p style={{ lineHeight: '1.6' }}>
          After you sign up, you can log in and send emails to any other registered address. When you enter the recipient's address the fee price will be displayed so there are no suprises. Each sent email will include your name and email address so the recipient knows who to reply to, but will come from our official address (mail@prioritypost.net) so they know it was sent through Priority Post.
        </p>
        <h3>Receiving Emails</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>
          What you do with emails sent from Priority Post of course is entirely up to you. If you want to make sure that you don't accidentally miss any, you can create a custom filter in your email client so that emails from mail@prioritypost.net are sorted into a priority folder or given a priority label.
        </p>
        <h3>Setting Your Fee</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>
          You can set your fee price on the Settings page. The default fee is zero, which means it's free to send you an email through Priority Post. The minimum fee price is $0.5. 
        </p>
        <h3>Where do the Fees Go?</h3>
        <p style={{ lineHeight: '1.6' }}>
          After transaction costs from Stripe (2.9% of the fee + $0.30 per successful transaction), Priority Post takes 10% of the remaining funds, and the rest goes to charity, namely the <a href="https://www.givewell.org/our-giving-funds#All_Grants_Fund" target="_blank">GiveWell All Grants Fund</a>. 
	<br /> For example: 
	<br /> - For a $1 fee, $0.33 goes to Stripe, $0.08 goes to Priority Post and $0.69 goes to GiveWell.
	<br /> - For a $5 fee, $0.45 goes to Stripe, $0.46 goes to Priority Post and $4.54 goes to GiveWell.
        </p>
      </div>
    </main>
  );
}

export default HowItWorks;