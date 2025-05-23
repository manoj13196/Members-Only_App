/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

type Message = {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  author?: { firstName: string; lastName: string; email: string };
};

export default function MessagesPage() {
  const { token, user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', content: '' });
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const fetchMessages = async () => {
    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('http://localhost:3000/messages', { method: 'GET', headers });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to load');
      setMessages(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchMessages();
  }, [token]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    setDeleteError('');

    try {
      if (!token) throw new Error('You must be logged in to post messages');

      const res = await fetch('http://localhost:3000/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to post message');

      setSubmitSuccess('Message posted!');
      setForm({ title: '', content: '' });

      await fetchMessages();
    } catch (err: any) {
      setSubmitError(err.message);
    }
  }

  // **New:** Delete message handler for admins
  async function handleDelete(id: number) {
    setDeleteError('');
    setSubmitSuccess('');
    setSubmitError('');

    if (!token) {
      setDeleteError('You must be logged in as admin to delete messages.');
      return;
    }

    // Confirm before delete
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const res = await fetch(`http://localhost:3000/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete message');

      setSubmitSuccess('Message deleted!');
      await fetchMessages();
    } catch (err: any) {
      setDeleteError(err.message);
    }
  }

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="container">
      <h2>Messages</h2>

      {user ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <input
          type='text'
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            style={{ width: '100%', marginBottom: 8 }}
          />
          <textarea
            name="content"
            placeholder="Content"
            value={form.content}
            onChange={handleChange}
            required
            rows={4}
            style={{ width: '100%', marginBottom: 8 }}
          />
          <button type="submit">Post Message</button>
          {submitError && <p className="error">{submitError}</p>}
          {submitSuccess && <p className="success">{submitSuccess}</p>}
          {deleteError && <p className="error">{deleteError}</p>}
        </form>
      ) : (
        <p>Please log in to post messages.</p>
      )}

      <ul className="message-list">
        {messages.map(msg => (
          <li key={msg.id} style={{ borderBottom: '1px solid #ddd', padding: '1rem 0', position: 'relative' }}>
            <h3>{msg.title}</h3>
            <p>{msg.content}</p>
            <small>
              {user?.isMember
                ? `By ${msg.author?.firstName || msg.author?.email} on ${new Date(msg.timestamp).toLocaleString()}`
                : `Anonymous on ${new Date(msg.timestamp).toLocaleString()}`}
            </small>

            {/* Show delete button ONLY for admins */}
            {user?.isAdmin && (
              <button
                onClick={() => handleDelete(msg.id)}
                style={{ position: 'absolute', right: 0, top: '1rem', color: 'white' , backgroundColor:'red'}}
                aria-label="Delete message"
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
