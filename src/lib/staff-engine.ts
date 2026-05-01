import { firestore } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp, 
  runTransaction,
  increment,
  addDoc,
  query,
  where,
  getDocs,
  limit,
  Timestamp
} from 'firebase/firestore';

/**
 * Senior Architect Staff Workflow Engine
 * Manages verification stages, escort assignments, and performance scoring.
 */

// 1. Multi-Stage Verification Logic
export const processVerificationReports = async (propertyId: string, adminId: string) => {
  const reportsRef = collection(firestore, 'verification_reports');
  const q = query(reportsRef, where('property_id', '==', propertyId));
  const snap = await getDocs(q);
  
  if (snap.size >= 2) {
    const reports = snap.docs.map(d => d.data());
    const recommendations = reports.map(r => r.approval_status);
    
    return await runTransaction(firestore, async (transaction) => {
      const propRef = doc(firestore, 'properties', propertyId);
      
      if (recommendations.every(r => r === 'approved')) {
        // CASE 1: Both Approve
        transaction.update(propRef, {
          status: 'verified',
          isPublic: true,
          verifiedAt: serverTimestamp(),
          lastModifiedBy: adminId
        });
        return { status: 'LIVE', message: 'Property approved and live' };
      } else if (recommendations.every(r => r === 'rejected')) {
        // CASE 2: Both Reject
        transaction.update(propRef, {
          status: 'rejected',
          isPublic: false,
          lastModifiedBy: adminId
        });
        return { status: 'REJECTED', message: 'Property rejected by both verifiers' };
      } else {
        // CASE 3: Conflict
        transaction.update(propRef, {
          status: 'conflict_review',
          lastModifiedBy: adminId
        });
        return { status: 'CONFLICT', message: 'Conflicting reports. Third verifier required.' };
      }
    });
  }
  return { status: 'PENDING', message: 'Waiting for secondary verification' };
};

// 2. Visit Escort Check-In Logic
export const performEscortCheckIn = async (logId: string, staffId: string, location: { lat: number; lng: number }) => {
  const logRef = doc(firestore, 'visit_escort_logs', logId);
  
  return await runTransaction(firestore, async (transaction) => {
    const snap = await transaction.get(logRef);
    if (!snap.exists()) throw new Error("Log not found");
    if (snap.data().staff_id !== staffId) throw new Error("Unauthorized");

    transaction.update(logRef, {
      checkin_time: serverTimestamp(),
      latitude: location.lat,
      longitude: location.lng,
      visit_status: 'checked_in'
    });

    // Log Activity
    const activityRef = doc(collection(firestore, 'staff_activity_logs'));
    transaction.set(activityRef, {
      staff_id: staffId,
      action_type: 'CHECK_IN',
      entity_type: 'visit_escort',
      entity_id: logId,
      created_at: serverTimestamp()
    });
  });
};

// 3. Performance Scoring Engine
export const updateStaffPerformance = async (staffId: string, metrics: { completed?: number; rejected?: number; escalated?: number }) => {
  const perfRef = doc(firestore, 'staff_performance', staffId);
  
  await runTransaction(firestore, async (transaction) => {
    const snap = await transaction.get(perfRef);
    const data = snap.exists() ? snap.data() : { completed_tasks: 0, rejected_tasks: 0, escalation_count: 0, rating_score: 100 };
    
    const newCompleted = data.completed_tasks + (metrics.completed || 0);
    const newRejected = data.rejected_tasks + (metrics.rejected || 0);
    const newEscalated = data.escalation_count + (metrics.escalated || 0);
    
    // Simple Scoring Formula
    let score = 100;
    if (newCompleted > 0) {
      score = ((newCompleted - (newRejected * 2) - (newEscalated * 5)) / newCompleted) * 100;
    }
    score = Math.max(0, Math.min(100, score));

    transaction.set(perfRef, {
      staff_id: staffId,
      completed_tasks: newCompleted,
      rejected_tasks: newRejected,
      escalation_count: newEscalated,
      rating_score: Math.round(score),
      last_updated: serverTimestamp()
    }, { merge: true });

    // Update staff profile score
    const profileRef = doc(firestore, 'staff_profiles', staffId);
    transaction.update(profileRef, { performance_score: Math.round(score) });
  });
};
