import { firestore, auth } from './firebase';
import { doc, updateDoc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { verifyAdmin } from './auth-guards';
import { sendNotification } from './notifications';

/**
 * Senior Architect Admin Overrides
 * Admin has unrestricted access to override any status or delete any entity.
 */

export const adminOverrideStatus = async (collectionName: string, docId: string, newStatus: string, metadata?: Record<string, any>) => {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized: Only admins can override status.");

  try {
    const docRef = doc(firestore, collectionName, docId);
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
      adminOverride: true,
      adminId: auth.currentUser?.uid,
      overrideReason: metadata?.reason || "System Override"
    });

    // Notify the user about the admin override
    if (metadata?.ownerId) {
      await sendNotification({
        user_id: metadata.ownerId,
        role: metadata.ownerRole || 'tenant',
        type: 'system',
        title: `Status Overridden by Admin`,
        message: `An administrator has updated the status of your ${collectionName.slice(0, -1)} to ${newStatus.replace('_', ' ').toUpperCase()}.`,
        metadata: { docId, collectionName, newStatus }
      });
    }

    return true;
  } catch (error) {
    console.error(`Admin override failed for ${collectionName}/${docId}:`, error);
    throw error;
  }
};

export const adminDeleteEntity = async (collectionName: string, docId: string) => {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized: Only admins can delete entities.");

  try {
    const docRef = doc(firestore, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Admin deletion failed for ${collectionName}/${docId}:`, error);
    throw error;
  }
};
