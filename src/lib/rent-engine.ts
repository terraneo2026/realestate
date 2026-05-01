import { firestore } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp, 
  runTransaction,
  Timestamp,
  addDoc
} from 'firebase/firestore';

/**
 * Senior Architect Rent & Escalation Engine
 * Manages recurring rent cycles, reminders, and legal escalation.
 */

// 1. Trigger Rent Reminders
export const processRentReminders = async () => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  
  const pendingQ = query(
    collection(firestore, 'rent_payments'),
    where('status', '==', 'pending'),
    where('dueDate', '<=', Timestamp.now())
  );
  
  const snap = await getDocs(pendingQ);
  
  for (const rentDoc of snap.docs) {
    const data = rentDoc.data();
    const dueDate = data.dueDate.toDate();
    const diffDays = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays === 1) {
      // Day 1: Friendly Reminder
      await notifyTenant(data.tenantId, 'Rent Due', 'Your rent for this month is due. Please pay via the portal.');
    } else if (diffDays === 7) {
      // Day 7: Grace Period Warning
      await updateRentStatus(rentDoc.id, 'overdue');
      await notifyTenant(data.tenantId, 'Rent Overdue', 'Your rent is now 7 days overdue. A late fee may apply.');
    } else if (diffDays === 15) {
      // Day 15: Admin Escalation
      await updateRentStatus(rentDoc.id, 'escalated');
      await logLegalEscalation(rentDoc.id, 'admin_review');
    }
  }
};

// 2. Log Legal Notice
export const logLegalEscalation = async (paymentId: string, level: 'admin_review' | 'legal_notice') => {
  const noticeRef = collection(firestore, 'legal_notices');
  await addDoc(noticeRef, {
    paymentId,
    level,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
};

const updateRentStatus = async (id: string, status: string) => {
  const ref = doc(firestore, 'rent_payments', id);
  await runTransaction(firestore, async (tx) => {
    tx.update(ref, { status, updatedAt: serverTimestamp() });
  });
};

const notifyTenant = async (userId: string, title: string, message: string) => {
  // Trigger internal notification system
  const notifRef = collection(firestore, 'notifications');
  await addDoc(notifRef, {
    userId,
    title,
    message,
    role: 'tenant',
    is_read: false,
    created_at: serverTimestamp()
  });
};
