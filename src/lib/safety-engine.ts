import { firestore } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  serverTimestamp, 
  runTransaction,
  increment
} from 'firebase/firestore';
import { EDGE_CASE_TYPE, ENFORCEMENT_ACTION } from './validations/safety-workflow';

/**
 * Senior Systems Engineer - Platform Safety Service
 * Centralized logic for monitoring violations and triggering enforcement.
 */

export const logEdgeCaseEvent = async (event: {
  type: keyof typeof EDGE_CASE_TYPE;
  entity_type: 'property' | 'user' | 'booking' | 'transaction';
  entity_id: string;
  actor_id: string;
  risk_score: number;
  metadata?: any;
}) => {
  const eventRef = collection(firestore, 'edge_case_events');
  const eventDoc = await addDoc(eventRef, {
    ...event,
    created_at: serverTimestamp(),
  });

  // If risk score is high, trigger automatic enforcement
  if (event.risk_score >= 80) {
    await triggerAutomatedEnforcement(eventDoc.id, event.actor_id, event.type);
  }

  return eventDoc.id;
};

const triggerAutomatedEnforcement = async (eventId: string, targetId: string, type: string) => {
  const enforcementRef = collection(firestore, 'enforcement_actions');
  
  let action: keyof typeof ENFORCEMENT_ACTION = 'RELIABILITY_SCORE_DECREASE';
  let reason = `Automated enforcement for ${type} violation.`;

  if (type === 'FAKE_LISTING') {
    action = 'SUSPEND_LISTING';
    reason = "Automatic suspension due to suspected fake property listing.";
  } else if (type === 'AGENT_DATA_LEAK') {
    action = 'BLOCK_ACCOUNT';
    reason = "Critical: Immediate account block due to suspected data leak detection.";
  }

  await addDoc(enforcementRef, {
    event_id: eventId,
    action_type: action,
    target_id: targetId,
    reason,
    automated: true,
    applied_by: 'SYSTEM_SAFETY_ENGINE',
    created_at: serverTimestamp(),
  });

  // Update User Risk Score
  const riskRef = doc(firestore, 'fraud_risk_scores', targetId);
  await setDoc(riskRef, {
    violation_count: increment(1),
    last_flagged_at: serverTimestamp(),
    risk_level: 'high'
  }, { merge: true });
};

// Rent Locking Logic
export const lockPropertyRent = async (propertyId: string, currentRent: number, actorId: string) => {
  const propRef = doc(firestore, 'properties', propertyId);
  
  return await runTransaction(firestore, async (tx) => {
    tx.update(propRef, {
      rentLocked: true,
      lastRentLockDate: serverTimestamp()
    });

    const historyRef = doc(collection(firestore, 'property_price_history'));
    tx.set(historyRef, {
      property_id: propertyId,
      old_price: currentRent,
      new_price: currentRent,
      changed_by: actorId,
      change_reason: 'Automatic Lock: First Visit Requested',
      created_at: serverTimestamp()
    });
  });
};
