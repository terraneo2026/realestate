import { firestore } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  runTransaction,
  increment,
  addDoc
} from 'firebase/firestore';

/**
 * Senior Fintech Architect Ledger Engine
 * Manages immutable financial records and transaction-safe wallet updates.
 */

// 1. Create Ledger Entry (Immutable)
export const createLedgerEntry = async (transaction: {
  transaction_id: string;
  transaction_type: string;
  debit_account: string;
  credit_account: string;
  amount: number;
  metadata?: any;
}) => {
  const ledgerRef = collection(firestore, 'financial_ledger');
  await addDoc(ledgerRef, {
    ...transaction,
    currency: 'INR',
    status: 'posted',
    created_at: serverTimestamp(),
  });
};

// 2. Transaction-Safe Wallet Update
export const updateWalletBalance = async (userId: string, amount: number, type: 'credit' | 'debit', reference: { id: string; type: string; reason: string }) => {
  const walletRef = doc(firestore, 'wallets', userId);
  
  return await runTransaction(firestore, async (tx) => {
    const walletSnap = await tx.get(walletRef);
    const currentBalance = walletSnap.exists() ? walletSnap.data().balance : 0;
    
    if (type === 'debit' && currentBalance < amount) {
      throw new Error("Insufficient wallet balance");
    }

    const newBalance = type === 'credit' ? currentBalance + amount : currentBalance - amount;

    // 1. Update Wallet
    tx.set(walletRef, {
      user_id: userId,
      balance: newBalance,
      updated_at: serverTimestamp()
    }, { merge: true });

    // 2. Log Wallet Transaction
    const txLogRef = doc(collection(firestore, 'wallet_transactions'));
    tx.set(txLogRef, {
      wallet_id: userId,
      transaction_type: type,
      amount,
      reference_id: reference.id,
      reference_type: reference.type,
      status: 'completed',
      reason: reference.reason,
      created_at: serverTimestamp()
    });

    // 3. Post to Financial Ledger
    const ledgerRef = doc(collection(firestore, 'financial_ledger'));
    tx.set(ledgerRef, {
      transaction_id: txLogRef.id,
      transaction_type: `WALLET_${type.toUpperCase()}`,
      debit_account: type === 'credit' ? 'SYSTEM_CASH' : 'TENANT_WALLET',
      credit_account: type === 'credit' ? 'TENANT_WALLET' : 'SYSTEM_CASH',
      amount,
      currency: 'INR',
      status: 'posted',
      metadata: { reason: reference.reason },
      created_at: serverTimestamp()
    });

    return { success: true, newBalance };
  });
};

// 3. Handle Token Split (No-Show Case)
export const processTokenNoShow = async (requestId: string, tokenAmount: number, ownerId: string) => {
  const platformShare = tokenAmount * 0.7;
  const ownerShare = tokenAmount * 0.3;

  await runTransaction(firestore, async (tx) => {
    // Post to Platform Revenue
    const revenueRef = doc(collection(firestore, 'platform_earnings'));
    tx.set(revenueRef, {
      amount: platformShare,
      type: 'TOKEN_NO_SHOW_70',
      reference_id: requestId,
      created_at: serverTimestamp()
    });

    // Credit Owner Wallet/Payout
    const payoutRef = doc(collection(firestore, 'payout_transactions'));
    tx.set(payoutRef, {
      owner_id: ownerId,
      amount: ownerShare,
      type: 'TOKEN_COMPENSATION_30',
      status: 'PENDING',
      reference_id: requestId,
      created_at: serverTimestamp()
    });

    // Immutable Ledger Entry
    const ledgerRef = doc(collection(firestore, 'financial_ledger'));
    tx.set(ledgerRef, {
      transaction_id: requestId,
      transaction_type: 'TOKEN_SPLIT_NO_SHOW',
      debit_account: 'TOKEN_ESCROW',
      credit_account: 'PLATFORM_REVENUE_AND_OWNER_PAYOUT',
      amount: tokenAmount,
      status: 'posted',
      created_at: serverTimestamp()
    });
  });
};
