import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { authApi } from '../services/api';

interface CurrentUser {
  userId: string;
  email: string;
  nombre: string;
  rol: string;
  token: string;
}

interface AuthContextType {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await authApi.login(email, password);
      const user: CurrentUser = {
        userId: '',
        email: result.email,
        nombre: result.nombreCompleto,
        rol: result.rol,
        token: result.token,
      };
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated: currentUser !== null,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}