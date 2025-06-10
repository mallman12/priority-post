// File: netlify/functions/signup.js

import { createClient } from '@supabase/supabase-js'

// Connect to your Supabase database
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export const handler = async (event) => {
  // We only care about POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email } = JSON.parse(event.body);

    // Insert the new email into your Supabase 'emails' table
    const { data, error } = await supabase
      .from('emails')
      .insert([
        { email: email },
      ])
      .select()

    // If there was an error inserting, throw it
    if (error) {
      throw error;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email signed up successfully!', data: data }),
    };
  } catch (error) {
    // Return a more informative error message
    return { 
      statusCode: 500, 
      body: JSON.stringify({ message: `Database Error: ${error.message}` })
    };
  }
};