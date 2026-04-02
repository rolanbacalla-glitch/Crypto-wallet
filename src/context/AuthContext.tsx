import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth as firebaseAuth } from '../services/firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';

interface User {
  address: string;
  ens?: string;
  profileImage?: string;
  uid?: string;
}

interface AuthContextType {
  user: User | null;
  login: (address: string, ens?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  firebaseUser: FirebaseUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nest_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser && user && !user.uid) {
        const updated = { ...user, uid: fbUser.uid };
        setUser(updated);
        localStorage.setItem('nest_user', JSON.stringify(updated));
      }
    });
    return () => unsubscribe();
  }, [user]);

  const login = async (address: string, ens?: string) => {
    setIsLoggingIn(true);
    try {
      // Sign in to Firebase anonymously
      const cred = await signInAnonymously(firebaseAuth);
      const newUser = { 
        address, 
        ens, 
        profileImage: ens ? ens.slice(0, 2).toUpperCase() : '??',
        uid: cred.user.uid 
      };
      setUser(newUser);
      localStorage.setItem('nest_user', JSON.stringify(newUser));
    } catch (error) {
      console.error("Firebase auth failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nest_user');
    firebaseAuth.signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isLoggingIn,
      firebaseUser
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
