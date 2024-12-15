import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyAobftgBl0GD2fc23SntCuzpuxKQpfFttk",
    authDomain: "habitquest-f1c4b.firebaseapp.com",
    projectId: "habitquest-f1c4b",
    storageBucket: "habitquest-f1c4b.firebasestorage.app",
    messagingSenderId: "119106371376",
    appId: "1:119106371376:web:48269e81a842988a4492f5",
    measurementId: "G-S1G6DNQY6N"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
export const db = getFirestore(app);

// Collection references
export const HABITS_COLLECTION = 'habits';
export const PROGRESS_COLLECTION = 'habitProgress';
