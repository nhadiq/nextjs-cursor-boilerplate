import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

// Firebase configuration object from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
};

// Initialize Firebase if not already initialized
let app: FirebaseApp | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let googleProvider: GoogleAuthProvider | null = null;

const initializeFirebase = () => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured. Please add Firebase environment variables.');
  }

  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
};

// Get auth instance (lazy initialization)
const getAuthInstance = () => {
  if (!auth) {
    initializeFirebase();
  }
  return auth!;
};

// Get Google provider instance (lazy initialization)
const getGoogleProvider = () => {
  if (!googleProvider) {
    initializeFirebase();
  }
  return googleProvider!;
};

// Sign up with email and password
export const signUpWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  const authInstance = getAuthInstance();
  return createUserWithEmailAndPassword(authInstance, email, password);
};

// Sign in with email and password
export const signInWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  const authInstance = getAuthInstance();
  return firebaseSignInWithEmailAndPassword(authInstance, email, password);
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserCredential> => {
  const authInstance = getAuthInstance();
  const provider = getGoogleProvider();
  return signInWithPopup(authInstance, provider);
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  const authInstance = getAuthInstance();
  return signOut(authInstance);
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  const authInstance = getAuthInstance();
  return sendPasswordResetEmail(authInstance, email);
};

// Current user
export const getCurrentUser = (): User | null => {
  const authInstance = getAuthInstance();
  return authInstance.currentUser;
};

// Auth state change listener
export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
  const authInstance = getAuthInstance();
  return onAuthStateChanged(authInstance, callback);
};

// Export auth getter for compatibility
export const getFirebaseAuth = () => getAuthInstance();

// Export configuration check
export { isFirebaseConfigured }; 