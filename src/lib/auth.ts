import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  getAuth
} from "firebase/auth";
import { auth } from "./firebase";

export const setupRecaptcha = (containerId: string) => {
  if (typeof window === "undefined") return;
  
  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: (response: any) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
    },
    "expired-callback": () => {
      // Response expired. Ask user to solve reCAPTCHA again.
    }
  });
  
  return verifier;
};

export const sendOTP = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmationResult;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export const verifyOTP = async (confirmationResult: ConfirmationResult, otp: string) => {
  try {
    const result = await confirmationResult.confirm(otp);
    const user = result.user;
    return user;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};
