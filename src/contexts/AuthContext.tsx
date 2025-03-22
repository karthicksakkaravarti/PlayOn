import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { auth } from '../services/firebase';

// Mock User type since we don't have the real Firebase User type
interface User {
  uid: string;
  phoneNumber: string | null;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

// Define the shape of our context
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  signOut: async () => {},
});

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock auth state listener
  useEffect(() => {
    // Simulate auth state check
    setTimeout(() => {
      // For demo purposes, start with no user
      setCurrentUser(null);
      setLoading(false);
    }, 1000);

    // In a real app, we would use:
    // const unsubscribe = auth.onAuthStateChanged((user) => {
    //   setCurrentUser(user);
    //   setLoading(false);
    // });
    // return unsubscribe;

    return () => {};
  }, []);

  // Sign out function
  const signOut = async () => {
    // For demo purposes
    setCurrentUser(null);
    return Promise.resolve();
    
    // In a real app:
    // return auth.signOut();
  };

  // Value to be provided to consumers
  const value = {
    currentUser,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext; 