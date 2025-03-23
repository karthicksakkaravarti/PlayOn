import { 
  PhoneAuthProvider, 
  signInWithCredential, 
  ApplicationVerifier,
  UserCredential,
  Auth
} from 'firebase/auth';
import { 
  auth, 
  firestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc 
} from './firebase';
import { User, UserRole } from '../types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const USER_STORAGE_KEY = '@PlayOn:user';

// Firestore collection names
const USERS_COLLECTION = 'users';

/**
 * Starts the phone authentication process by sending an OTP
 * @param phoneNumber - The phone number in E.164 format
 * @param recaptchaVerifier - The reCAPTCHA verifier instance
 * @returns A promise that resolves to a verification ID
 */
export const sendVerificationCode = async (
  phoneNumber: string, 
  recaptchaVerifier: ApplicationVerifier
): Promise<string> => {
  try {
    const phoneProvider = new PhoneAuthProvider(auth);
    const verificationId = await phoneProvider.verifyPhoneNumber(
      phoneNumber,
      recaptchaVerifier
    );
    return verificationId;
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw error;
  }
};

/**
 * Verifies the OTP and signs in the user
 * @param verificationId - The verification ID received from sendVerificationCode
 * @param verificationCode - The OTP entered by the user
 * @returns A promise that resolves to a User object
 */
export const verifyCode = async (
  verificationId: string,
  verificationCode: string
): Promise<User> => {
  try {
    // Create credential
    const credential = PhoneAuthProvider.credential(
      verificationId,
      verificationCode
    );
    
    // Sign in with credential
    const userCredential: UserCredential = await signInWithCredential(auth, credential);
    const firebaseUser = userCredential.user;

    // Create or get user from Firestore
    const userRef = doc(firestore, USERS_COLLECTION, firebaseUser.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // User exists, update last login time
      const userData = userDoc.data() as User;
      
      // Update last login in Firestore
      await updateDoc(userRef, {
        updatedAt: Date.now()
      });
      
      // Save user to AsyncStorage
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      
      return userData;
    } else {
      // Create new user document
      const newUser: User = {
        id: firebaseUser.uid,
        phoneNumber: firebaseUser.phoneNumber || '',
        role: UserRole.USER,
        createdAt: firebaseUser.metadata.creationTime 
          ? new Date(firebaseUser.metadata.creationTime).getTime() 
          : Date.now(),
        updatedAt: Date.now()
      };
      
      // Save to Firestore
      await setDoc(userRef, newUser);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      
      return newUser;
    }
  } catch (error) {
    console.error('Error verifying code:', error);
    throw error;
  }
};

/**
 * Updates the user profile
 * @param userData - The user data to update
 * @returns A promise that resolves to the updated User object
 */
export const updateUser = async (userData: Partial<User>, currentUser: User): Promise<User> => {
  try {
    // Get the user reference
    const userRef = doc(firestore, USERS_COLLECTION, currentUser.id);
    
    // Update the user object in memory
    const updatedUser: User = {
      ...currentUser,
      ...userData,
      updatedAt: Date.now()
    };
    
    // Save to Firestore - only save the fields that were updated plus the timestamp
    const updateData = {
      ...userData,
      updatedAt: updatedUser.updatedAt
    };
    
    await updateDoc(userRef, updateData);
    
    // Save updated user to AsyncStorage
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    
    console.log('User data updated successfully:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Signs out the current user
 */
export const signOut = async (): Promise<void> => {
  try {
    // Sign out of Firebase
    await auth.signOut();
    
    // Remove user from AsyncStorage
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}; 