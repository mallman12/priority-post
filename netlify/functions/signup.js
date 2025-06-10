// netlify/functions/signup.js
const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event) => {
  try {
    const { email } = JSON.parse(event.body);
    const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

    await client.query(
      q.Create(q.Collection('emails'), { data: { email } })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email signed up successfully!' }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};