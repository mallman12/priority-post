// File: netlify/functions/send-verified-email.js
// This is the correct and final version of the code.

import { createClient } from '@supabase/supabase-js';
// import axios from 'axios';
import axios from 'axios/dist/node/axios.cjs';

// This client is an "Admin" client because it uses the service_role key
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const formData = JSON.parse(event.body);
    const { to_email } = formData;

    // 1. VERIFY the recipient's email exists using the Supabase Auth Admin API
    const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(to_email);

    // Check if the lookup returned an error or if no user object was found in the data
    if (userError || !userData.user) {
      console.error('User not found in Supabase Auth or database error:', userError);
      return { statusCode: 404, body: JSON.stringify({ message: "Sorry, this address is not registered with us." }) };
    }

    // 2. If email exists, SEND the email using the EmailJS REST API
    const emailJsData = {
      service_id: process.env.VITE_EMAILJS_SERVICE_ID,
      template_id: process.env.VITE_EMAILJS_TEMPLATE_ID,
      user_id: process.env.VITE_EMAILJS_PUBLIC_KEY,
      template_params: formData,
      accessToken: process.env.EMAILJS_PRIVATE_KEY
    };

    await axios.post('https://api.emailjs.com/api/v1.0/email/send', emailJsData);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully!" })
    };

  } catch (error) {
    console.error("Function crashed with error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `An error occurred in the backend: ${error.message}` })
    };
  }
};