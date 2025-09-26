import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { me } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem('user-cred')?.user || '');
  
  const [role, setRole] = useState(localStorage.getItem('user-cred')?.role || 'guest');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await me();
        if (currentUser?.role) {
          setUser(currentUser);
          setRole(currentUser.role);
        } else {
          setUser(null);
          setRole('guest');
        }
      } catch (error) {
        console.error("Auth fetch error:", error);
        setUser(null);
        setRole('guest');
      } finally {
        setLoading(false);
      }
    };

    // const token = localStorage.getItem('authToken');
    const token = JSON.parse(localStorage.getItem('user-cred'))?.token ||  '';
    if (token) fetchUser();
    else setLoading(false);
  }, []);


  const authContextValue = useMemo(() => ({
    user,
    setUser,
    role,
    setRole,
    loading,
    isAuthenticated: !!user    
  }), [user, role, loading]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
