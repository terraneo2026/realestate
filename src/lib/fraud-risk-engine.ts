import { firestore } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp, 
  runTransaction,
  limit,
  Timestamp
} from 'firebase/firestore';

/**
 * Fraud Prevention Specialist - Risk Scoring Engine
 * Detects anomalies and calculates dynamic user risk levels.
 */

export interface RiskSignal {
  userId: string;
  type: 'CANCELLATION' | 'NO_SHOW' | 'BYPASS' | 'COMPLAINT';
  severity: number; // 1-10
}

export const processRiskSignal = async (signal: RiskSignal) => {
  const riskRef = doc(firestore, 'fraud_risk_scores', signal.userId);
  
  await runTransaction(firestore, async (tx) => {
    const snap = await tx.get(riskRef);
    const data = snap.exists() ? snap.data() : { violation_count: 0, cumulative_risk: 0 };

    const newViolationCount = data.violation_count + 1;
    const newRiskScore = data.cumulative_risk + signal.severity;

    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (newRiskScore >= 50) riskLevel = 'critical';
    else if (newRiskScore >= 30) riskLevel = 'high';
    else if (newRiskScore >= 15) riskLevel = 'medium';

    tx.set(riskRef, {
      user_id: signal.userId,
      risk_level: riskLevel,
      cumulative_risk: newRiskScore,
      violation_count: newViolationCount,
      last_flagged_at: serverTimestamp(),
      updated_at: serverTimestamp()
    }, { merge: true });

    // Log Fraud Event
    const eventRef = doc(collection(firestore, 'fraud_risk_events'));
    tx.set(eventRef, {
      user_id: signal.userId,
      signal_type: signal.type,
      severity: signal.severity,
      created_at: serverTimestamp()
    });
  });
};

// Detect Suspicious Cancellation Patterns
export const detectCancellationAnomaly = async (userId: string) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const q = query(
    collection(firestore, 'edge_case_events'),
    where('actor_id', '==', userId),
    where('type', '==', 'OWNER_CANCEL_AFTER_PAYMENT'),
    where('created_at', '>', Timestamp.fromDate(sevenDaysAgo)),
    limit(5)
  );

  const snap = await getDocs(q);
  if (snap.size >= 3) {
    // 3 cancellations in 7 days = High Risk
    await processRiskSignal({
      userId,
      type: 'CANCELLATION',
      severity: 20
    });
  }
};
