import { auth, firestore } from './firebase';
import { doc, getDoc, query, collection, where, getCountFromServer } from 'firebase/firestore';

/**
 * Senior Architect Guard: verifyAdmin
 * Checks if the current authenticated user has the 'admin' role.
 */
export const verifyAdmin = async (): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    const userRef = doc(firestore, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      return data.role === 'admin';
    }
    return false;
  } catch (error) {
    console.error('Admin verification failed:', error);
    return false;
  }
};

/**
 * Senior Architect Guard: canOverride
 * Admins can override any status, others can only update their own entities.
 */
export const canOverride = async (resourceOwnerId: string): Promise<boolean> => {
  const isAdmin = await verifyAdmin();
  if (isAdmin) return true;

  const user = auth.currentUser;
  return user?.uid === resourceOwnerId;
};

/**
 * Senior Architect Guard: checkListingLimit
 * Checks if the user (agent/owner) has reached their package's listing limit.
 */
export const checkListingLimit = async (userId: string): Promise<{ allowed: boolean; message?: string }> => {
  try {
    // 1. Get user's current subscription
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    if (!userData) return { allowed: false, message: "User not found" };
    if (userData.role === 'admin') return { allowed: true }; // Admins have no limit

    const plan = userData.plan || 'free';
    const listingLimit = userData.listingLimit || (plan === 'free' ? 2 : 100); // Defaults

    // 2. Count current active properties
    const q = query(
      collection(firestore, 'properties'),
      where('ownerId', '==', userId),
      where('status', 'in', ['active', 'approved', 'pending', 'published'])
    );
    const snap = await getCountFromServer(q);
    const currentCount = snap.data().count;

    if (currentCount >= listingLimit) {
      return { 
        allowed: false, 
        message: `You have reached your listing limit of ${listingLimit} properties. Please upgrade your package.` 
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Listing limit check failed:', error);
    return { allowed: false, message: "Verification failed" };
  }
};
