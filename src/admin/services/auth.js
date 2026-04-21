import { auth, db } from "../lib/firebase";
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  onAuthStateChanged, 
  signOut,
  signInWithEmailAndPassword
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

/**
 * Initialize Recaptcha for Phone Auth
 */
export const setupRecaptcha = (containerId) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(containerId, {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    }, auth);
  }
};

/**
 * Sign In with Phone Number
 */
export const signInWithPhone = async (phoneNumber) => {
  const appVerifier = window.recaptchaVerifier;
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    return confirmationResult;
  } catch (error) {
    console.error("Phone Auth Error:", error);
    throw error;
  }
};

/**
 * Confirm Phone Code
 */
export const confirmPhoneCode = async (code) => {
  try {
    const result = await window.confirmationResult.confirm(code);
    const user = result.user;
    
    // Check if user exists in Firestore, if not create profile
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        phoneNumber: user.phoneNumber,
        createdAt: new Date().toISOString(),
        role: 'user' // Default role
      });
    }
    
    return user;
  } catch (error) {
    console.error("Confirm Code Error:", error);
    throw error;
  }
};

/**
 * Admin Login (using Email/Password if needed, or check Firestore role)
 */
export const adminLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check admin role in Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists() && userSnap.data().role === 'admin') {
      return user;
    } else {
      await signOut(auth);
      throw new Error("Unauthorized: Access denied");
    }
  } catch (error) {
    console.error("Admin Login Error:", error);
    throw error;
  }
};

/**
 * Logout
 */
export const logout = async () => {
  return await signOut(auth);
};

/**
 * Monitor Auth State
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
