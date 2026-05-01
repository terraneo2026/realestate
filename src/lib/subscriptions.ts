import { firestore } from './firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp, query, where, getDocs, Timestamp, writeBatch } from 'firebase/firestore';

export interface Subscription {
  id?: string;
  agentId: string;
  packageId: string;
  packageName: string;
  price: number;
  duration: number;
  listingLimit: number;
  startDate: any;
  expiryDate: any;
  status: 'active' | 'expired' | 'cancelled';
}

/**
 * Subscribe an agent to a package.
 * Uses a transaction-like batch to ensure both the subscription and user doc are updated.
 */
export const subscribeToPackage = async (agentId: string, pkg: any) => {
  try {
    const batch = writeBatch(firestore);
    
    // 1. Create subscription document
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(startDate.getDate() + pkg.duration);

    const subscriptionData: Subscription = {
      agentId,
      packageId: pkg.id,
      packageName: pkg.name,
      price: pkg.price,
      duration: pkg.duration,
      listingLimit: pkg.listingLimit,
      startDate: serverTimestamp(),
      expiryDate: Timestamp.fromDate(expiryDate),
      status: 'active',
    };

    const subRef = doc(collection(firestore, 'agent_subscriptions'));
    batch.set(subRef, subscriptionData);

    // 2. Update user document with current subscription info
    const userRef = doc(firestore, 'users', agentId);
    batch.update(userRef, {
      currentSubscriptionId: subRef.id,
      plan: pkg.name,
      listingLimit: pkg.listingLimit,
      subscriptionExpiry: Timestamp.fromDate(expiryDate),
      updatedAt: serverTimestamp()
    });

    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error subscribing to package:', error);
    return false;
  }
};

/**
 * Check and update expired subscriptions for a user.
 * This can be called on login or dashboard load.
 */
export const checkSubscriptionExpiry = async (userId: string) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return;
    
    const userData = userSnap.data();
    if (!userData.subscriptionExpiry) return;

    const expiry = userData.subscriptionExpiry.toDate();
    if (expiry < new Date() && userData.plan !== 'free') {
      // Plan expired - revert to free
      await updateDoc(userRef, {
        plan: 'free',
        listingLimit: 2, // Default free limit
        currentSubscriptionId: null,
        updatedAt: serverTimestamp()
      });
      
      // Update subscription doc status
      if (userData.currentSubscriptionId) {
        const subRef = doc(firestore, 'agent_subscriptions', userData.currentSubscriptionId);
        await updateDoc(subRef, { status: 'expired' });
      }
      
      return true; // Expired
    }
    return false; // Still active
  } catch (error) {
    console.error('Error checking subscription expiry:', error);
    return false;
  }
};

import { getDoc } from 'firebase/firestore';
