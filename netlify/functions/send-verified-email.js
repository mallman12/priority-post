import { createClient } from '@supabase/supabase-js';
// import axios from 'axios';
import axios from 'axios/dist/node/axios.cjs';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export const handler = async (event) => {

  console.log("Backend function received event body:", event.body);

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const formData = JSON.parse(event.body);
    const { to_email } = formData;

    // --- THIS IS THE FINAL, CORRECTED VERIFICATION LOGIC ---
    // 1. Call our custom `is_email_verified` function in the database.
    const { data: isVerified, error: rpcError } = await supabase.rpc('is_email_verified', {
      email_to_check: to_email
    });

    // Check for an error from the function call, or if the result is `false`.
    if (rpcError || !isVerified) {
      console.error('RPC error or email is not verified:', rpcError);
      return { statusCode: 404, body: JSON.stringify({ message: "Sorry, this address is not registered or has not been verified." }) };
    }
    // --- END OF VERIFICATION LOGIC ---

    // 2. If verified, send the email.
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