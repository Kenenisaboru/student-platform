import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  // Return a safe default instead of throwing — prevents crash on auth pages (Login/Register)
  // when context isn't available due to HMR or initialization race conditions
  if (!context) {
    return {
      user: null,
      loading: false,
      login: async () => { throw new Error('AuthProvider not ready'); },
      register: async () => { throw new Error('AuthProvider not ready'); },
      logout: () => {},
      updateProfile: () => {},
    };
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  // If we already have a user and token, don't block the UI with a spinner
  const [loading, setLoading] = useState(() => !localStorage.getItem('token'));

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token) {
          setUser(null);
          return;
        }

        if (storedUser && !user) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.warn('Malformed stored user data');
          }
        }

        const { data } = await API.get('/auth/me');
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      } catch (err) {
        console.error('Session validation failed:', err.message);
        // Do not force logout on network errors (only on 401 handled by interceptor)
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      const { token, ...userData } = data;
      localStorage.removeItem('pendingEmail');
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return data;
    } catch (err) {
      if (err.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
        localStorage.setItem('pendingEmail', err.response.data.email || email);
      }
      throw err;
    }
  };

  const register = async (formData) => {
    const { data } = await API.post('/auth/register', formData);
    localStorage.setItem('pendingEmail', formData.email);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const updateProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};