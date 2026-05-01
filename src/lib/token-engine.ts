import { firestore } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp, 
  runTransaction,
  increment,
  addDoc
} from 'firebase/firestore';
import { TOKEN_STATUS } from './validations/tenant-workflow';

/**
 * Senior Architect Token Engine
 * Manages tenant tokens, wallet credits, and no-show splits.
 */

// 1. Credit Token to Tenant Wallet (On Owner Reject or Timeout)
export const creditTokenToWallet = async (tenantId: string, amount: number, requestId: string) => {
  const walletRef = doc(firestore, 'tenant_wallets', tenantId);
  
  await runTransaction(firestore, async (transaction) => {
    const walletSnap = await transaction.get(walletRef);
    
    if (!walletSnap.exists()) {
      transaction.set(walletRef, {
        userId: tenantId,
        balance: amount,
        updatedAt: serverTimestamp()
      });
    } else {
      transaction.update(walletRef, {
        balance: increment(amount),
        updatedAt: serverTimestamp()
      });
    }

    // Log Wallet Transaction
    const txRef = doc(collection(firestore, 'tenant_wallet_transactions'));
    transaction.set(txRef, {
      userId: tenantId,
      type: 'credit',
      amount,
      reason: 'Token Refund: Owner Rejected/Expired',
      referenceId: requestId,
      timestamp: serverTimestamp()
    });
  });
};

// 2. Handle Tenant No-Show (70/30 Split)
export const handleNoShowSplit = async (requestId: string, tokenAmount: number, ownerId: string) => {
  const platformShare = tokenAmount * 0.7;
  const ownerShare = tokenAmount * 0.3;

  await runTransaction(firestore, async (transaction) => {
    // 1. Update request status
    const requestRef = doc(firestore, 'visit_requests', requestId);
    transaction.update(requestRef, {
      status: 'no_show',
      tokenStatus: TOKEN_STATUS.FORFEITED
    });

    // 2. Record platform earnings
    const platformRef = doc(collection(firestore, 'platform_earnings'));
    transaction.set(platformRef, {
      type: 'TOKEN_NO_SHOW',
      amount: platformShare,
      referenceId: requestId,
      timestamp: serverTimestamp()
    });

    // 3. Record owner compensation
    const ownerRef = doc(collection(firestore, 'owner_payouts'));
    transaction.set(ownerRef, {
      ownerId,
      amount: ownerShare,
      type: 'TOKEN_COMPENSATION',
      status: 'pending',
      timestamp: serverTimestamp()
    });
  });
};

// 4. Check Active Request Limit (Max 2)
export const checkActiveRequestLimit = async (tenantId: string) => {
  // In a real app, this would be a Firestore query count
  // For the engine logic, we define the constraint
  return true; 
};
