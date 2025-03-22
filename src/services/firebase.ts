import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth, 
  PhoneAuthProvider, 
  signInWithCredential, 
  ApplicationVerifier,
  PhoneInfoOptions,
  Auth
} from 'firebase/auth';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get Firebase configuration from Expo Constants (environment variables)
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId,
  measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId,
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} else {
  app = getApp();
  auth = getAuth(app);
}

// Export Firebase services
export { app, auth, PhoneAuthProvider, signInWithCredential }; 