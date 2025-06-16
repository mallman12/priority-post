import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

function StripeFeeSetup() {
  const { user } = useAuth();
  // State for the fee displayed on the page (the "source of truth")
  const [savedFee, setSavedFee] = useState('0.00');
  // State for the value inside the input form
  const [formFee, setFormFee] = useState('0.00');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFee = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('fee')
        .eq('id', user.id)
        .single();

      if (data && data.fee !== null) {
        const formattedFee = Number(data.fee).toFixed(2);
        // Set both states when data is loaded
        setSavedFee(formattedFee);
        setFormFee(formattedFee);
      }
      setLoading(false);
    };

    getFee();
  }, [user]);

  const handleFeeUpdate = async (e) => {
    e.preventDefault();
    // Use the form's state to update the database
    const { error } = await supabase
      .from('profiles')
      .update({ fee: formFee })
      .eq('id', user.id);

    if (error) {
      setMessage(`Error updating fee: ${error.message}`);
    } else {
      setMessage('Fee updated successfully!');
      // On success, update the "saved" state to match the form state
      setSavedFee(formFee);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="card">
      {/* This now reads from the 'savedFee' state */}
      <h3>Your Current Fee: ${savedFee} USD</h3>
      <hr style={{ margin: '1.5rem 0' }} />

      <h2>Update Your Fee</h2>
      <p>Set a price (in USD) for others to email you. Set to 0 for emails to be free.</p>
      <form onSubmit={handleFeeUpdate}>
        <input
          type="number"
          // The input is now controlled by 'formFee' state
          value={formFee}
          onChange={(e) => setFormFee(e.target.value)}
          placeholder="Fee in USD"
          min="0"
          step="0.01"
        />
        <button type="submit">Set Fee</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default StripeFeeSetup;