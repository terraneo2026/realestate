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
  addDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { PAYMENT_STATUS } from './validations/financial-workflow';

/**
 * Senior Fintech Architect Payment Engine
 * Handles escrow holding, commission calculation, and payout releases.
 */

// 1. Calculate Commissions based on Admin Rules
export const calculateCommissions = async (rent: number, dealType: 'direct' | 'agent', category: string) => {
  const rulesRef = collection(firestore, 'commission_rules');
  const q = query(rulesRef, where('deal_type', '==', dealType), where('property_category', '==', category), where('active_status', '==', true));
  const snap = await getDocs(q);
  
  const rule = snap.empty ? { 
    tenant_commission_type: 'percentage', 
    tenant_commission_value: 10,
    owner_commission_type: 'percentage',
    owner_commission_value: 10,
    tax_percentage: 18
  } : snap.docs[0].data();

  const calc = (type: string, val: number) => type === 'percentage' ? (rent * val) / 100 : val;

  const tenantCommission = calc(rule.tenant_commission_type, rule.tenant_commission_value);
  const ownerCommission = calc(rule.owner_commission_type, rule.owner_commission_value);
  const tax = (tenantCommission + ownerCommission) * (rule.tax_percentage / 100);

  return {
    tenant_commission: tenantCommission,
    owner_commission: ownerCommission,
    tax: tax,
    total_platform_fee: tenantCommission + ownerCommission + tax,
    owner_payout: rent - ownerCommission
  };
};

// 2. Initialize Escrow for Advance Payment
export const initializeEscrow = async (bookingId: string, tenantId: string, ownerId: string, amount: number) => {
  const escrowRef = doc(firestore, 'escrow_transactions', bookingId);
  
  await setDoc(escrowRef, {
    booking_id: bookingId,
    tenant_id: tenantId,
    owner_id: ownerId,
    total_amount: amount,
    held_amount: amount,
    released_amount: 0,
    status: PAYMENT_STATUS.ESCROW_HELD,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  });

  // Log to Ledger
  const ledgerRef = collection(firestore, 'financial_ledger');
  await addDoc(ledgerRef, {
    transaction_id: bookingId,
    transaction_type: 'ESCROW_DEPOSIT',
    debit_account: 'GATEWAY_CASH',
    credit_account: 'ESCROW_ACCOUNT',
    amount: amount,
    status: 'posted',
    created_at: serverTimestamp()
  });
};

// 3. Release Payout to Owner
export const releaseOwnerPayout = async (bookingId: string, adminId: string) => {
  const escrowRef = doc(firestore, 'escrow_transactions', bookingId);
  
  return await runTransaction(firestore, async (tx) => {
    const snap = await tx.get(escrowRef);
    if (!snap.exists()) throw new Error("Escrow record not found");
    
    const data = snap.data();
    if (data.status !== PAYMENT_STATUS.ESCROW_HELD) throw new Error("Funds not in escrow");

    const fees = await calculateCommissions(data.total_amount, 'direct', 'standard'); // Simplified for engine logic

    // 1. Mark Escrow as Released
    tx.update(escrowRef, {
      status: PAYMENT_STATUS.COMPLETED,
      released_amount: fees.owner_payout,
      commission_deducted: fees.total_platform_fee,
      updated_at: serverTimestamp()
    });

    // 2. Create Payout Record
    const payoutRef = doc(collection(firestore, 'payout_transactions'));
    tx.set(payoutRef, {
      owner_id: data.owner_id,
      amount: fees.owner_payout,
      booking_id: bookingId,
      status: 'INITIATED',
      processed_by: adminId,
      created_at: serverTimestamp()
    });

    // 3. Ledger Entries for Splits
    const ledgerEntryRef = doc(collection(firestore, 'financial_ledger'));
    // Debit Escrow
    tx.set(ledgerEntryRef, {
      transaction_id: bookingId,
      transaction_type: 'ESCROW_RELEASE',
      debit_account: 'ESCROW_ACCOUNT',
      credit_account: 'OWNER_PAYOUT_AND_PLATFORM_REVENUE',
      amount: data.total_amount,
      status: 'posted',
      created_at: serverTimestamp()
    });

    return { success: true, payout: fees.owner_payout };
  });
};
