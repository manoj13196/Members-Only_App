import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './index.css'
import HomePage from './pages/HomePage';        // NEW: welcome page
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MessagesPage from './pages/MessagePage';
import JoinClubPage from './pages/JoinClubPage';
import Navbar from './components/Navbar';

export default function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={user ? <Navigate to="/messages" /> : <HomePage />} />
        <Route path="/login" element={user ? <Navigate to="/messages" /> : <LoginPage />} />
        <Route path="/signup" element={user ? <Navigate to="/messages" /> : <SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/messages"
          element={user ? <MessagesPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/join-club"
          element={user ? <JoinClubPage /> : <Navigate to="/login" replace />}
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to={user ? "/messages" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
