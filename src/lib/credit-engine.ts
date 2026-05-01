import { firestore } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp, 
  runTransaction,
  increment,
  addDoc,
  query,
  where,
  getDocs,
  limit
} from 'firebase/firestore';

import { getCreditExpiryConfig } from './config-engine';

/**
 * Senior Architect Agent Credit Engine
 * Manages credit-based property unlocking, transaction logging, and auto-returns.
 */

// 1. Deduct Credit to Unlock Property
export const unlockPropertyWithCredit = async (agentId: string, propertyId: string) => {
  return await runTransaction(firestore, async (transaction) => {
    // 1. Check Agent's active subscription and credits
    const subQuery = query(
      collection(firestore, 'agent_subscriptions'),
      where('agentId', '==', agentId),
      where('status', '==', 'active'),
      limit(1)
    );
    const subSnap = await getDocs(subQuery);
    if (subSnap.empty) throw new Error("No active subscription found");
    
    const subDoc = subSnap.docs[0];
    const subData = subDoc.data();
    
    if (subData.creditsRemaining <= 0) {
      throw new Error("Insufficient credits. Please upgrade your package.");
    }

    // 2. Check if property is already locked or rented
    const propRef = doc(firestore, 'properties', propertyId);
    const propSnap = await transaction.get(propRef);
    if (!propSnap.exists()) throw new Error("Property not found");
    
    const propData = propSnap.data();
    if (propData.status === 'locked_by_agent' || propData.status === 'BOOKED') {
      throw new Error("Property is currently unavailable or locked by another agent");
    }

    // 3. Deduct credit
    transaction.update(subDoc.ref, {
      creditsRemaining: increment(-1),
      creditsUsed: increment(1),
      updatedAt: serverTimestamp()
    });

    // 4. Create Transaction Log
    const txRef = doc(collection(firestore, 'agent_credit_transactions'));
    transaction.set(txRef, {
      agentId,
      propertyId,
      type: 'debit',
      amount: 1,
      reason: 'Property Unlock',
      timestamp: serverTimestamp()
    });

    return { success: true };
  });
};

// 2. Return Credit (If property rented externally or unavailable)
export const returnAgentCredit = async (agentId: string, propertyId: string, reason: string) => {
  const subQuery = query(
    collection(firestore, 'agent_subscriptions'),
    where('agentId', '==', agentId),
    where('status', '==', 'active'),
    limit(1)
  );
  
  await runTransaction(firestore, async (transaction) => {
    const subSnap = await getDocs(subQuery);
    if (subSnap.empty) return;
    
    const subDoc = subSnap.docs[0];
    
    transaction.update(subDoc.ref, {
      creditsRemaining: increment(1),
      creditsUsed: increment(-1),
      updatedAt: serverTimestamp()
    });

    const txRef = doc(collection(firestore, 'agent_credit_transactions'));
    transaction.set(txRef, {
      agentId,
      propertyId,
      type: 'credit',
      amount: 1,
      reason: `Auto Return: ${reason}`,
      timestamp: serverTimestamp()
    });
  });
};

// 3. Check Credit Expiry (Scheduled Task Logic)
export const processExpiredCredits = async () => {
  const expiryConfig = await getCreditExpiryConfig();
  if (!expiryConfig || !expiryConfig.active) return;

  const subQuery = query(
    collection(firestore, 'agent_subscriptions'),
    where('status', '==', 'active')
  );
  
  const snap = await getDocs(subQuery);
  const now = new Date();

  for (const subDoc of snap.docs) {
    const data = subDoc.data();
    const purchaseDate = data.updatedAt?.toDate() || data.startDate?.toDate();
    if (!purchaseDate) continue;

    const expiryDate = new Date(purchaseDate);
    expiryDate.setDate(expiryDate.getDate() + (data.expiryDuration || expiryConfig.durationDays));

    if (now > expiryDate && data.creditsRemaining > 0) {
      await runTransaction(firestore, async (transaction) => {
        transaction.update(subDoc.ref, {
          creditsExpired: increment(data.creditsRemaining),
          creditsRemaining: 0,
          status: 'expired',
          updatedAt: serverTimestamp()
        });

        const txRef = doc(collection(firestore, 'agent_credit_transactions'));
        transaction.set(txRef, {
          agentId: data.agentId,
          type: 'expiry',
          amount: data.creditsRemaining,
          reason: 'Policy-based Credit Expiry',
          timestamp: serverTimestamp()
        });
      });
    }
  }
};
