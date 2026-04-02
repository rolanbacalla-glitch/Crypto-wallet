import React, { createContext, useContext, useState } from 'react';

interface User {
  address: string;
  ens?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  login: (address: string, ens?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoggingIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nest_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const login = (address: string, ens?: string) => {
    setIsLoggingIn(true);
    setTimeout(() => {
      const newUser = { address, ens, profileImage: 'JD' };
      setUser(newUser);
      localStorage.setItem('nest_user', JSON.stringify(newUser));
      setIsLoggingIn(false);
    }, 1500);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nest_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isLoggingIn 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
