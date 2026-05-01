import { firestore } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';

export type NotificationRole = 'admin' | 'agent' | 'owner' | 'tenant' | 'all';
export type NotificationType = 'approval' | 'rejection' | 'booking' | 'payment' | 'message' | 'system';

export interface Notification {
  id?: string;
  user_id: string | null; // null for role-wide
  role: NotificationRole;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: any;
  metadata?: Record<string, any>;
}

/**
 * Send a notification to a specific user or a whole role.
 */
export const sendNotification = async (notification: {
  user_id: string | null;
  role: NotificationRole;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, any>;
}) => {
  try {
    const notificationsRef = collection(firestore, 'notifications');
    await addDoc(notificationsRef, {
      ...notification,
      is_read: false,
      created_at: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
};

/**
 * Mark a notification as read.
 */
export const markAsRead = async (notificationId: string) => {
  try {
    const notificationRef = doc(firestore, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      is_read: true,
    });
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

/**
 * Delete a notification.
 */
export const deleteNotification = async (notificationId: string) => {
  try {
    const notificationRef = doc(firestore, 'notifications', notificationId);
    await deleteDoc(notificationRef);
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
};

/**
 * Centralized Status Update with Notification Trigger
 */
export const updateStatusAndNotify = async (options: {
  collectionName: string;
  docId: string;
  newStatus: string;
  recipientId: string;
  recipientRole: NotificationRole;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, any>;
}) => {
  try {
    const { collectionName, docId, newStatus, recipientId, recipientRole, type, title, message, metadata } = options;
    
    const docRef = doc(firestore, collectionName, docId);
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });

    await sendNotification({
      user_id: recipientId,
      role: recipientRole,
      type,
      title,
      message,
      metadata: { ...metadata, [collectionName.slice(0, -1) + 'Id']: docId }
    });

    return true;
  } catch (error) {
    console.error('Error in updateStatusAndNotify:', error);
    return false;
  }
};

/**
 * Subscribe to notifications for a specific user and role.
 */
export const subscribeToNotifications = (
  userId: string,
  role: NotificationRole,
  onUpdate: (notifications: Notification[]) => void
) => {
  const notificationsRef = collection(firestore, 'notifications');
  
  // Query for notifications sent to this specific user OR to all users of this role
  // Note: We remove orderBy('created_at') to avoid requiring a composite index in Firestore.
  // Sorting is handled on the client side below.
  const q = query(
    notificationsRef,
    where('role', 'in', [role, 'all'])
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }))
      .filter((n) => !n.user_id || n.user_id === userId)
      .sort((a, b) => {
        const dateA = a.created_at?.toDate ? a.created_at.toDate() : new Date(a.created_at || 0);
        const dateB = b.created_at?.toDate ? b.created_at.toDate() : new Date(b.created_at || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .map((n) => ({
        ...n,
        // Ensure mapping to the expected interface
        is_read: n.is_read || n.status === 'read' || false,
        created_at: n.created_at || n.createdAt || null
      }));
      
    onUpdate(notifications);
  }, (error) => {
    console.error('Firestore Snapshot Error:', error);
    // Graceful handling for missing indexes or permission issues
  });
};
