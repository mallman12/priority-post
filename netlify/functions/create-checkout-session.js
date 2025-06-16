const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { amount, recipientEmail, fromEmail, fromName, subject, message } = JSON.parse(event.body);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Email to ${recipientEmail}`,
            },
            unit_amount: Math.round(amount * 100), // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.URL}/confirmed?from_email=${encodeURIComponent(fromEmail)}&to_email=${encodeURIComponent(recipientEmail)}&from_name=${encodeURIComponent(fromName)}&subject=${encodeURIComponent(subject)}&message=${encodeURIComponent(message)}`,
      cancel_url: `${process.env.URL}/`,
      metadata: {
        from_email: fromEmail,
        to_email: recipientEmail,
        from_name: fromName,
        subject: subject,
        message: message,
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};