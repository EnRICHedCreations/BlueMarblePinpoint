/**
 * Authentication Context
 * Manages authentication state across the application
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  checkMemberStatus,
  saveEmail,
  getStoredEmail,
  clearStoredEmail,
  AuthResult,
} from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  isLoading: boolean;
  login: (email: string) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for stored authentication on mount
  useEffect(() => {
    const storedEmail = getStoredEmail();
    if (storedEmail) {
      setIsAuthenticated(true);
      setUserEmail(storedEmail);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string): Promise<AuthResult> => {
    const result = await checkMemberStatus(email);

    if (result.success && result.isMember && result.isPremiumAnnual) {
      saveEmail(email);
      setIsAuthenticated(true);
      setUserEmail(email);
    }

    return result;
  };

  const logout = () => {
    clearStoredEmail();
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userEmail,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
