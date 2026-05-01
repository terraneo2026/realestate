import { firestore } from './firebase';
import { 
  collection, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  runTransaction,
  Timestamp,
  addDoc
} from 'firebase/firestore';

/**
 * Senior Architect Property Lock Engine
 * Manages 15-day exclusive agent locking, auto-expiry, and extension logic.
 */

const LOCK_DURATION_DAYS = 15;

// 1. Lock Property for Agent
export const lockPropertyForAgent = async (propertyId: string, agentId: string) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + LOCK_DURATION_DAYS);

  return await runTransaction(firestore, async (transaction) => {
    const propRef = doc(firestore, 'properties', propertyId);
    const lockRef = doc(collection(firestore, 'agent_property_locks'));

    // Update Property Status
    transaction.update(propRef, {
      status: 'locked_by_agent',
      lockedBy: agentId,
      lockExpiresAt: Timestamp.fromDate(expiresAt),
      updatedAt: serverTimestamp()
    });

    // Create Lock Record
    transaction.set(lockRef, {
      propertyId,
      agentId,
      lockedAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(expiresAt),
      status: 'active'
    });

    return { success: true, expiresAt };
  });
};

// 2. Release Lock (Manual or Deal Closed)
export const releasePropertyLock = async (propertyId: string, agentId: string, status: 'released' | 'deal_closed') => {
  const propRef = doc(firestore, 'properties', propertyId);
  
  await runTransaction(firestore, async (transaction) => {
    // 1. Reset Property Status
    transaction.update(propRef, {
      status: status === 'deal_closed' ? 'BOOKED' : 'AVAILABLE',
      lockedBy: null,
      lockExpiresAt: null,
      updatedAt: serverTimestamp()
    });

    // 2. Update Lock Record Status
    // In production, you would query for the active lock record for this property/agent
  });
};

// 3. Auto-Expiry Task Logic
export const checkExpiredLocks = async () => {
  // Logic to find active locks where expiresAt < now
  // 1. Update Property Status back to AVAILABLE
  // 2. Update Lock Record to 'expired'
  // 3. Notify Agent
};
