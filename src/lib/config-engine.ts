import { firestore } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  limit, 
  orderBy,
  addDoc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { TokenConfig, CommissionConfig, AgentRadiusConfig, CreditExpiryRule } from './validations/configuration';

/**
 * Senior Architect Utility: Platform Configuration Engine
 * Manages fetching and versioning of platform-level settings.
 */

// 1. Tokens
export const getActiveTokenConfigs = async (): Promise<TokenConfig[]> => {
  const q = query(
    collection(firestore, 'platform_token_configs'),
    where('active', '==', true)
  );
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as TokenConfig));
};

export const getTokenAmountByCategory = async (category: string): Promise<number> => {
  const q = query(
    collection(firestore, 'platform_token_configs'),
    where('category', '==', category),
    where('active', '==', true),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return 0;
  return snap.docs[0].data().tokenAmount;
};

// 2. Commissions
export const getActiveCommissionConfig = async (side: string): Promise<CommissionConfig | null> => {
  const q = query(
    collection(firestore, 'platform_commission_configs'),
    where('side', '==', side),
    where('active', '==', true),
    orderBy('updatedAt', 'desc'),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const data = snap.docs[0].data();
  return { id: snap.docs[0].id, ...data } as CommissionConfig;
};

// 3. Radius
export const getAgentRadiusConfig = async (): Promise<AgentRadiusConfig | null> => {
  const q = query(
    collection(firestore, 'platform_radius_configs'),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as AgentRadiusConfig;
};

// 4. Expiry
export const getCreditExpiryConfig = async (): Promise<CreditExpiryRule | null> => {
  const q = query(
    collection(firestore, 'platform_expiry_configs'),
    where('active', '==', true),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as CreditExpiryRule;
};

// 5. Property Rules
export const getPropertyFeeRules = async (propertyId: string) => {
  const docRef = doc(firestore, 'property_fee_rules', propertyId);
  const snap = await getDoc(docRef);
  if (snap.exists()) return snap.data();
  return null;
};

/**
 * Audit Log Helper
 */
export const logConfigurationChange = async (
  adminId: string,
  module: string,
  action: string,
  oldValue: any,
  newValue: any,
  context?: { ip?: string; device?: string }
) => {
  await addDoc(collection(firestore, 'configuration_audit_logs'), {
    adminId,
    module,
    action,
    oldValue: JSON.parse(JSON.stringify(oldValue || {})),
    newValue: JSON.parse(JSON.stringify(newValue || {})),
    ipAddress: context?.ip || 'unknown',
    deviceInfo: context?.device || 'unknown',
    timestamp: serverTimestamp(),
  });
};
