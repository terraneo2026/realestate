import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
if (!firebaseConfig.apiKey) {
  console.error("[DEBUG] Firebase API Key is missing in firebase.ts!");
} else {
  console.log("[DEBUG] Firebase initialized with API Key:", firebaseConfig.apiKey.substring(0, 5) + "...");
  console.log("[DEBUG] Project ID:", firebaseConfig.projectId);
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use lazy initialization for services to avoid build-time errors if config is missing
let auth: any;
let db: any;
let firestore: any;
let storage: any;

try {
  auth = getAuth(app);
  db = getDatabase(app);
  firestore = getFirestore(app);
  storage = getStorage(app);

  // Handle common browser storage errors like FILE_ERROR_NO_SPACE
  if (typeof window !== "undefined") {
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && (event.reason.name === 'UnknownError' || event.reason.message?.includes('FILE_ERROR_NO_SPACE'))) {
        console.error("Critical Storage Error: Browser disk space or IndexedDB limit reached.");
        console.info("Solution: Clear site data for localhost:3000 in Chrome DevTools (Application > Storage > Clear site data).");
      }
    });
  }
} catch (error) {
  console.error("[DEBUG] Error initializing Firebase services:", error);
}

// Analytics - client-side only and check if supported
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, firestore, storage, analytics };
