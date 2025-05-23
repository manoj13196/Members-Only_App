import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', textAlign: 'center' }}>
      <h1>Welcome to Clubhouse</h1>
      <p>Please <Link to="/signup">Sign Up</Link> or <Link to="/login">Log In</Link> to continue.</p>
    </div>
  );
}
