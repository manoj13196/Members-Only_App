import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
      <Link to="/messages" style={{ marginRight: '1rem' }}>
        Messages
      </Link>
      <Link to="/join-club" style={{ marginRight: '1rem' }}>
        Join Club
      </Link>
      {!user && (
        <>
          <Link to="/login" style={{ marginRight: '1rem' }}>
            Login
          </Link>
          <Link to="/signup">Signup</Link>
        </>
      )}
      {user && (
        <button
          onClick={() => logout()}
          style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                marginLeft: 16,
                fontSize: '1rem',
                fontWeight: '600',
              }}
        >
          Logout
        </button>
      )}
    </nav>
  );
}
