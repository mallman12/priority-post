// File: netlify/functions/send-verified-email.js

import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const formData = JSON.parse(event.body);
    const { to_email } = formData;

    // 1. VERIFY the recipient's email exists in Supabase
    const { data: emailData, error: dbError } = await supabase
      .from('emails')
      .select('email')
      .eq('email', to_email)
      .single(); // .single() will error if more than one, or return null if none

    if (dbError || !emailData) {
      console.error('Database error or email not found:', dbError);
      return { statusCode: 404, body: JSON.stringify({ message: "Recipient email not found in our database." }) };
    }

    // 2. If email exists, SEND the email using the EmailJS REST API
    const emailJsData = {
      service_id: process.env.VITE_EMAILJS_SERVICE_ID,
      template_id: process.env.VITE_EMAILJS_TEMPLATE_ID,
      user_id: process.env.VITE_EMAILJS_PUBLIC_KEY,
      template_params: formData,
      accessToken: process.env.EMAILJS_PRIVATE_KEY // Your private key for backend authentication
    };

    const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', emailJsData);

    if (response.status !== 200) {
      throw new Error('EmailJS failed to send email.');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully!" })
    };

  } catch (error) {
    console.error('An error occurred:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `An error occurred: ${error.message}` })
    };
  }
};