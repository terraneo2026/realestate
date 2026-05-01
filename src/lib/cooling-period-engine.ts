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
 * Senior Architect Cooling Period Engine
 * Enforces property-specific blocking periods after tenant rejection.
 */

export const activateCoolingPeriod = async (tenantId: string, propertyId: string) => {
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 48); // 48-hour cooling period

  const coolingRef = collection(firestore, 'cooling_periods');
  await addDoc(coolingRef, {
    tenantId,
    propertyId,
    expiryDate: Timestamp.fromDate(expiryDate),
    createdAt: serverTimestamp(),
  });
};

export const isUnderCoolingPeriod = async (tenantId: string, propertyId: string): Promise<boolean> => {
  const q = query(
    collection(firestore, 'cooling_periods'),
    where('tenantId', '==', tenantId),
    where('propertyId', '==', propertyId),
    where('expiryDate', '>', Timestamp.now())
  );
  
  const snap = await getDocs(q);
  return !snap.empty;
};
