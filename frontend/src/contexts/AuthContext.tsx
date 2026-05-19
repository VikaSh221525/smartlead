import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { UserRole } from '../types';
import { loginApi, registerApi } from '../api/auth.api';
import type { LoginPayload, RegisterPayload, AuthUser } from '../api/auth.api';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const getStoredUser = (): AuthUser | null => {
  try {
    const s = localStorage.getItem('sl_user');
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);

  const login = useCallback(async (data: LoginPayload) => {
    const res = await loginApi(data);
    localStorage.setItem('sl_token', res.token);
    localStorage.setItem('sl_user', JSON.stringify(res.user));
    setUser(res.user);
  }, []);

  const register = useCallback(async (data: RegisterPayload) => {
    const res = await registerApi(data);
    localStorage.setItem('sl_token', res.token);
    localStorage.setItem('sl_user', JSON.stringify(res.user));
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sl_token');
    localStorage.removeItem('sl_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === UserRole.ADMIN,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
