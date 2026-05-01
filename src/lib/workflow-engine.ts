import { firestore } from './firebase';
import { 
  doc, 
  updateDoc, 
  collection, 
  addDoc, 
  serverTimestamp, 
  runTransaction, 
  getDoc,
  Timestamp
} from 'firebase/firestore';
import { PROPERTY_WORKFLOW_STATUS, VISIT_REQUEST_STATUS, PropertyWorkflowStatus } from './validations/owner-workflow';

/**
 * Senior Architect Workflow Engine
 * Manages all state transitions for property verification and visit lifecycles.
 */

// 1. Property Verification Workflow
export const transitionPropertyStatus = async (
  propertyId: string, 
  newStatus: PropertyWorkflowStatus, 
  adminId: string,
  notes?: string
) => {
  const propertyRef = doc(firestore, 'properties', propertyId);
  
  await runTransaction(firestore, async (transaction) => {
    const propSnap = await transaction.get(propertyRef);
    if (!propSnap.exists()) throw new Error("Property not found");
    
    const oldStatus = propSnap.data().status;
    
    // Update property status
    transaction.update(propertyRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
      lastModifiedBy: adminId
    });

    // Log history
    const historyRef = doc(collection(firestore, 'property_status_history'));
    transaction.set(historyRef, {
      propertyId,
      oldStatus,
      newStatus,
      changedBy: adminId,
      notes: notes || `Status changed from ${oldStatus} to ${newStatus}`,
      timestamp: serverTimestamp()
    });
  });
};

// 2. Automated Admin Review Logic
export const evaluateVerificationReports = async (propertyId: string, adminId: string) => {
  const reportsRef = collection(firestore, 'property_verification_reports');
  // In a real app, we'd query for all reports for this propertyId
  // For simplicity, we assume we have access to both reports here
  
  // Example logic:
  // const reports = await getDocs(query(reportsRef, where('propertyId', '==', propertyId)));
  // if (reports.size === 2) {
  //    const recommendations = reports.docs.map(d => d.data().recommendation);
  //    if (recommendations.every(r => r === 'approve')) {
  //       await transitionPropertyStatus(propertyId, PROPERTY_WORKFLOW_STATUS.APPROVED, adminId);
  //    } else if (recommendations.every(r => r === 'reject')) {
  //       await transitionPropertyStatus(propertyId, PROPERTY_WORKFLOW_STATUS.REJECTED, adminId);
  //    } else {
  //       await transitionPropertyStatus(propertyId, PROPERTY_WORKFLOW_STATUS.CONFLICT_REVIEW, adminId);
  //    }
  // }
};

// 3. Visit Request Expiry Logic (48-hour rule)
export const checkExpiredVisitRequests = async () => {
  // This would typically be run by a cron job
  // const now = Timestamp.now();
  // const fortyEightHoursAgo = new Timestamp(now.seconds - (48 * 3600), now.nanoseconds);
  
  // 1. Query pending_owner_review requests created > 48h ago
  // 2. For each:
  //    a. Status -> EXPIRED
  //    b. Trigger refund to tenant wallet
  //    c. Notify tenant and owner
};

// 4. Visit Acceptance Workflow
export const acceptVisitRequest = async (requestId: string, ownerId: string) => {
  const requestRef = doc(firestore, 'visit_requests', requestId);
  
  await runTransaction(firestore, async (transaction) => {
    const snap = await transaction.get(requestRef);
    if (!snap.exists()) throw new Error("Request not found");
    if (snap.data().ownerId !== ownerId) throw new Error("Unauthorized");
    
    transaction.update(requestRef, {
      status: VISIT_REQUEST_STATUS.OWNER_ACCEPTED,
      acceptedAt: serverTimestamp()
    });
    
    // Additional logic: Notify staff to schedule visit
  });
};

// 5. Auto Property Locking
export const lockPropertyOnAgreement = async (propertyId: string) => {
  const propertyRef = doc(firestore, 'properties', propertyId);
  await updateDoc(propertyRef, {
    status: PROPERTY_WORKFLOW_STATUS.UNAVAILABLE,
    lockedAt: serverTimestamp(),
    isPublic: false
  });
};
