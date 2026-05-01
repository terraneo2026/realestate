import { firestore } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs,
  limit,
  updateDoc,
  increment
} from 'firebase/firestore';

/**
 * Senior Architect Anti-Bypass & Fraud Engine
 * Implements 5-layer bypass prevention and suspicious activity tracking.
 */

export const logSuspiciousActivity = async (
  userId: string,
  type: 'contact_bypass' | 'external_payment' | 'suspicious_activity' | 'fake_listing',
  severity: 'low' | 'medium' | 'high',
  description: string,
  metadata?: any
) => {
  const fraudRef = collection(firestore, 'fraud_flags');
  await addDoc(fraudRef, {
    userId,
    type,
    severity,
    description,
    metadata,
    timestamp: serverTimestamp(),
    status: 'pending_review'
  });

  // Increment user's fraud score
  const userRef = doc(firestore, 'users', userId);
  const scoreIncrement = severity === 'high' ? 50 : severity === 'medium' ? 20 : 5;
  await updateDoc(userRef, {
    fraudScore: increment(scoreIncrement),
    lastFraudFlag: type,
    updatedAt: serverTimestamp()
  });
};

/**
 * Layer 1: Contact Masking Check
 * Logic to detect if a user is trying to share phone numbers or emails in messages.
 */
export const scanForBypassAttempt = (text: string): boolean => {
  const phoneRegex = /(\+?\d{1,4}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/g;
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  
  return phoneRegex.test(text) || emailRegex.test(text);
};

/**
 * Layer 2: Suspicious Behavior Monitoring
 * Tracks if an owner repeatedly rejects visit requests or cancels bookings.
 */
export const checkOwnerHealth = async (ownerId: string) => {
  const requestsRef = collection(firestore, 'visit_requests');
  const q = query(
    requestsRef, 
    where('ownerId', '==', ownerId), 
    where('status', '==', 'owner_rejected'),
    limit(10)
  );
  
  const snap = await getDocs(q);
  if (snap.size >= 5) {
    await logSuspiciousActivity(
      ownerId, 
      'suspicious_activity', 
      'medium', 
      'High rejection rate for visit requests'
    );
  }
};

/**
 * Layer 3: Staff-Supervised Visit Verification
 * Ensures staff was actually at the location during the visit.
 */
export const verifyVisitLocation = (
  staffLat: number, 
  staffLng: number, 
  propertyLat: number, 
  propertyLng: number
): boolean => {
  // Simple distance calculation (Haversine would be better for production)
  const distance = Math.sqrt(
    Math.pow(staffLat - propertyLat, 2) + Math.pow(staffLng - propertyLng, 2)
  );
  
  // Approximately 200 meters tolerance
  return distance < 0.002; 
};
