import { firestore } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  serverTimestamp, 
  runTransaction,
  increment 
} from 'firebase/firestore';
import { calculateCommission } from './commission-engine';
import { getActiveCommissionConfig } from './config-engine';

/**
 * Senior Architect Escrow & Payout Engine
 * Manages the financial lifecycle of a deal from tenant payment to owner payout.
 */

export const processEscrowPayment = async (
  bookingId: string,
  tenantId: string,
  ownerId: string,
  monthlyRent: number,
  advanceAmount: number,
  context: { ip?: string; device?: string }
) => {
  return await runTransaction(firestore, async (transaction) => {
    // 1. Get platform commission configuration for owners
    const commissionConfig = await getActiveCommissionConfig('owner_direct'); // Default to direct for now
    
    if (!commissionConfig) {
      throw new Error("Platform commission configuration not found");
    }

    // 2. Calculate platform commission
    const platformFee = calculateCommission(
      commissionConfig.type as any,
      commissionConfig.value,
      { monthlyRent }
    );

    const gst = platformFee * 0.18; // 18% GST on platform fee
    const ownerPayout = advanceAmount - platformFee - gst;

    // 3. Create Escrow Payment record
    const escrowRef = doc(collection(firestore, 'escrow_payments'));
    transaction.set(escrowRef, {
      bookingId,
      tenantId,
      ownerId,
      amounts: {
        monthlyRent,
        advanceAmount,
        gst,
        platformFee,
        ownerPayout
      },
      status: 'paid',
      payoutStatus: 'pending',
      createdAt: serverTimestamp(),
      ipAddress: context.ip,
      deviceInfo: context.device
    });

    // 4. Update booking status
    const bookingRef = doc(firestore, 'bookings', bookingId);
    transaction.update(bookingRef, {
      paymentStatus: 'paid',
      status: 'BOOKED',
      escrowId: escrowRef.id
    });

    // 5. Update platform earnings ledger
    const ledgerRef = doc(collection(firestore, 'platform_earnings'));
    transaction.set(ledgerRef, {
      type: 'COMMISSION',
      amount: platformFee,
      gst,
      bookingId,
      timestamp: serverTimestamp()
    });

    return { success: true, escrowId: escrowRef.id, ownerPayout };
  });
};

export const releaseOwnerPayout = async (escrowId: string, adminId: string) => {
  const escrowRef = doc(firestore, 'escrow_payments', escrowId);
  
  await runTransaction(firestore, async (transaction) => {
    const snap = await transaction.get(escrowRef);
    if (!snap.exists()) throw new Error("Escrow record not found");
    if (snap.data().payoutStatus !== 'pending') throw new Error("Payout already processed or invalid state");

    transaction.update(escrowRef, {
      payoutStatus: 'settled',
      settlementDate: serverTimestamp(),
      settledBy: adminId
    });

    // Create payout transaction record for owner
    const payoutRef = doc(collection(firestore, 'owner_payouts'));
    transaction.set(payoutRef, {
      ownerId: snap.data().ownerId,
      amount: snap.data().amounts.ownerPayout,
      escrowId,
      bookingId: snap.data().bookingId,
      status: 'completed',
      timestamp: serverTimestamp()
    });
  });
};
