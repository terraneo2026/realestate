import { firestore } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export type NotificationRole = 'admin' | 'agent' | 'owner' | 'tenant' | 'all';
export type NotificationType = 'activity' | 'status_update' | 'system' | 'alert';
export type NotificationCategory = 'approval' | 'booking' | 'payment' | 'property' | 'system';

export interface Notification {
  id?: string;
  recipientId: string | null; // UID or null for role-wide
  recipientRole: NotificationRole;
  senderId?: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: any;
  updatedAt: any;
}

/**
 * Send a notification to a specific user or a whole role.
 */
export const sendNotification = async (notification: Omit<Notification, 'createdAt' | 'updatedAt' | 'isRead'>) => {
  try {
    const notificationsRef = collection(firestore, 'notifications');
    await addDoc(notificationsRef, {
      ...notification,
      isRead: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
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
      isRead: true,
      updatedAt: serverTimestamp(),
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
 * Subscribe to notifications for a specific user and role.
 */
export const subscribeToNotifications = (
  userId: string,
  role: NotificationRole,
  onUpdate: (notifications: Notification[]) => void
) => {
  const notificationsRef = collection(firestore, 'notifications');
  
  // Query for notifications sent to this specific user OR to all users of this role
  const q = query(
    notificationsRef,
    where('recipientRole', 'in', [role, 'all']),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Notification, 'id'>),
      }))
      .filter((n) => !n.recipientId || n.recipientId === userId);
      
    onUpdate(notifications);
  });
};
