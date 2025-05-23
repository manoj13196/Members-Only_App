/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';  // fix import, jwtDecode is default export

// User payload decoded from JWT token
type UserPayload = {
  sub: number;       
  email: string;
  isMember?: boolean; 
  isAdmin?: boolean;  
};

type AuthContextType = {
  user: UserPayload | null;
  setUser: React.Dispatch<React.SetStateAction<UserPayload | null>>; // add setter here

  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserPayload | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('clubhouse_token');
    if (stored) {
      setToken(stored);
      const decoded = jwtDecode<UserPayload>(stored);
      setUser(decoded);
    }
  }, []);

  function login(newToken: string) {
    localStorage.setItem('clubhouse_token', newToken);
    setToken(newToken);
    const decoded = jwtDecode<UserPayload>(newToken);
    setUser(decoded);
  }

  function logout() {
    localStorage.removeItem('clubhouse_token');
    setToken(null);
    setUser(null);
  }

  // Provide setUser so you can update user anywhere (e.g. JoinClub)
  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
