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
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Firestore
} from 'firebase/firestore';
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
let firestore: Firestore;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);
} else {
  app = getApp();
  auth = getAuth(app);
  firestore = getFirestore(app);
}

// Export Firebase services
export { 
  app, 
  auth, 
  firestore,
  // Auth exports
  PhoneAuthProvider, 
  signInWithCredential,
  // Firestore exports
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter
}; 