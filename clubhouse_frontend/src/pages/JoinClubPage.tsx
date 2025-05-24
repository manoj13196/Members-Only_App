/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function JoinClubPage() {
  // Get user info and token from AuthContext
  const { token, setUser } = useAuth();

  // State to hold the passcode input
  const [passcode, setPasscode] = useState('');

  // State to show success or error messages
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPasscode(e.target.value);
  }

  // Handle form submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!token) {
      setError('You must be logged in to join the club.');
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const res = await fetch(`${API_URL}/auth/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ secretCode: passcode }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to join club');

      setMessage(data.message || 'success'); // The backend returns a success string like "You are now a club member!"

      // Update local user state to isMember: true so UI updates immediately
      setUser(prevUser => {
  if (!prevUser) return null;
  return {
    ...prevUser,
    isMember: true,
  };
});

    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Join the Club</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter secret passcode"
          value={passcode}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <button type="submit">Join</button>
      </form>

      {message && <p style={{ color: 'green', marginTop: 10 }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
    </div>
  );
}
