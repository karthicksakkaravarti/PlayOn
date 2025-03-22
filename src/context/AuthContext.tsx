import React, { createContext, useEffect, useReducer, useState, useRef } from 'react';
import { User, AuthContextType, AuthState, UserRole } from '../types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { app } from '../services/firebase'; 
import { sendVerificationCode, verifyCode, updateUser, signOut } from '../services/auth';
import { View } from "react-native";

// Initial auth state
const initialState: AuthState = {
  currentUser: null,
  loading: true,
  error: null,
  initialized: false
};

// Create the auth context
export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => '',
  verifyOTP: async () => ({} as User),
  updateUserProfile: async () => ({} as User),
  logout: async () => {},
  resetError: () => {}
});
// Action types for the reducer
type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_ERROR'; error: string }
  | { type: 'AUTH_SUCCESS'; user: User }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_RESET_ERROR' }
  | { type: 'AUTH_INITIALIZED' };

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  console.log('🔍 AUTH DEBUG: Reducer action:', action.type, action);
  
  switch (action.type) {
    case 'AUTH_LOADING':
      console.log('🔍 AUTH DEBUG: Setting loading state');
      return { ...state, loading: true, error: null };
    case 'AUTH_ERROR':
      console.log('🔍 AUTH DEBUG: Error occurred:', action.error);
      return { ...state, loading: false, error: action.error };
    case 'AUTH_SUCCESS':
      console.log('🔍 AUTH DEBUG: Auth success, user:', action.user);
      return { ...state, loading: false, error: null, currentUser: action.user, initialized: true };
    case 'AUTH_LOGOUT':
      console.log('🔍 AUTH DEBUG: Logging out user');
      return { ...state, currentUser: null, error: null };
    case 'AUTH_RESET_ERROR':
      console.log('🔍 AUTH DEBUG: Resetting error state');
      return { ...state, error: null };
    case 'AUTH_INITIALIZED':
      console.log('🔍 AUTH DEBUG: Auth initialized, loading = false');
      return { ...state, initialized: true, loading: false };
    default:
      return state;
  }
};

// Storage keys
const USER_STORAGE_KEY = '@PlayOn:user';

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const recaptchaVerifierRef = useRef<FirebaseRecaptchaVerifierModal | null>(null);

  // Attempt to restore user session from storage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔍 AUTH DEBUG: initializeAuth started');
      try {
        const userJson = await AsyncStorage.getItem(USER_STORAGE_KEY);
        console.log('🔍 AUTH DEBUG: userJson from storage:', userJson);
        if (userJson) {
          const user = JSON.parse(userJson);
          console.log('🔍 AUTH DEBUG: user parsed from storage:', user);
          dispatch({ type: 'AUTH_SUCCESS', user });
        } else {
          console.log('🔍 AUTH DEBUG: No user in storage, dispatching AUTH_INITIALIZED');
          dispatch({ type: 'AUTH_INITIALIZED' });
        }
      } catch (error) {
        console.error('🔍 AUTH DEBUG: Error restoring auth state:', error);
        dispatch({ type: 'AUTH_INITIALIZED' });
      } finally {
        console.log('🔍 AUTH DEBUG: Auth initialization complete');
      }
    };
    
    console.log('🔍 AUTH DEBUG: Initializing auth');
    initializeAuth();
    
    // Safety fallback - force initialization after 3 seconds if still loading
    const timeoutId = setTimeout(() => {
      if (state.loading && !state.initialized) {
        console.log('🔍 AUTH DEBUG: Forced initialization due to timeout');
        dispatch({ type: 'AUTH_INITIALIZED' });
      }
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [state.loading, state.initialized]);

  // Login function - sends OTP to phoneNumber
  const login = async (phoneNumber: string): Promise<string> => {
    dispatch({ type: 'AUTH_LOADING' });
    
    try {
      // Format phone number if needed
      const formattedPhoneNumber = phoneNumber.startsWith('+')
        ? phoneNumber
        : `+${phoneNumber}`;
      
      // Check if recaptcha verifier is available
      if (!recaptchaVerifierRef.current) {
        throw new Error('reCAPTCHA verifier not initialized');
      }
      
      // Send verification code with Firebase
      const verificationId = await sendVerificationCode(
        formattedPhoneNumber,
        recaptchaVerifierRef.current
      );
      
      return verificationId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send verification code';
      dispatch({ type: 'AUTH_ERROR', error: errorMessage });
      throw error;
    }
  };

  // Verify OTP function - validates the OTP and signs in the user
  const verifyOTP = async (verificationId: string, otp: string): Promise<User> => {
    dispatch({ type: 'AUTH_LOADING' });
    
    try {
      // Verify code with Firebase
      const user = await verifyCode(verificationId, otp);
      
      dispatch({ type: 'AUTH_SUCCESS', user });
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify code';
      dispatch({ type: 'AUTH_ERROR', error: errorMessage });
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
    dispatch({ type: 'AUTH_LOADING' });
    
    try {
      if (!state.currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Update user with Firebase service
      const updatedUser = await updateUser(userData, state.currentUser);
      
      dispatch({ type: 'AUTH_SUCCESS', user: updatedUser });
      return updatedUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      dispatch({ type: 'AUTH_ERROR', error: errorMessage });
      throw error;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // Sign out using Firebase service
      await signOut();
      
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      console.error('Error logging out:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to log out';
      dispatch({ type: 'AUTH_ERROR', error: errorMessage });
    }
  };

  // Reset error state
  const resetError = () => {
    dispatch({ type: 'AUTH_RESET_ERROR' });
  };

  // Provide the auth context to children
  return (
    <>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifierRef}
        firebaseConfig={app.options}
        attemptInvisibleVerification={false}
        title="Prove you're human!"
        cancelLabel="Close"
      />
      <AuthContext.Provider
        value={{
          ...state,
          login,
          verifyOTP,
          updateUserProfile,
          logout,
          resetError
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
}; 