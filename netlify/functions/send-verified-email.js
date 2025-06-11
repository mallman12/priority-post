// File: netlify/functions/send-verified-email.js
// This is the corrected version using the proper supabase.auth.admin.listUsers() method.

import { createClient } from '@supabase/supabase-js';
// import axios from 'axios';
import axios from 'axios/dist/node/axios.cjs';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const formData = JSON.parse(event.body);
    const { to_email } = formData;

    // --- THIS IS THE FINAL, CORRECTED VERIFICATION LOGIC ---
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers({
      email: to_email,
    });

    if (userError) {
      console.error('Supabase admin API failed:', userError);
      return { statusCode: 500, body: JSON.stringify({ message: "An internal server error occurred." }) };
    }

    const user = users && users.length > 0 ? users[0] : null;

    if (!user || !user.email_confirmed_at) {
      console.log(`Attempt to email unverified or non-existent user: ${to_email}`);
      return { statusCode: 404, body: JSON.stringify({ message: "Sorry, this address is not registered or has not been verified." }) };
    }
    // --- END OF VERIFICATION LOGIC ---

    // 2. If user is verified, SEND the email using the EmailJS REST API.
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