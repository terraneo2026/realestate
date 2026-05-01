import { 
  doc, 
  runTransaction, 
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';
import { firestore } from './firebase';
import { BOOKING_STATUS, PROPERTY_STATUS } from './constants';
import { sendNotification, NotificationRole, NotificationType } from './notifications';

export interface BookingStateTransition {
  bookingId: string;
  newStatus: string;
  propertyId?: string;
  userId?: string;
  ownerId?: string;
  propertyTitle?: string;
  metadata?: any;
}

/**
 * Centralized Booking State Machine
 * Enforces strict transitions and side effects (property visibility, notifications)
 */
export async function transitionBookingState(transition: BookingStateTransition) {
  const { 
    bookingId, 
    newStatus, 
    propertyId, 
    userId, 
    ownerId, 
    propertyTitle,
    metadata = {} 
  } = transition;

  return await runTransaction(firestore, async (transaction) => {
    const bookingRef = doc(firestore, 'bookings', bookingId);
    
    // 1. Update Booking Status
    const bookingUpdates: any = {
      status: newStatus,
      updatedAt: serverTimestamp(),
      ...metadata
    };
    
    transaction.update(bookingRef, bookingUpdates);

    // 2. Side Effect: Property Visibility
    if (propertyId) {
      const propertyRef = doc(firestore, 'properties', propertyId);
      
      switch (newStatus) {
        case BOOKING_STATUS.VISIT_BOOKED:
          // HOLD -> hide from listings temporarily
          transaction.update(propertyRef, { status: PROPERTY_STATUS.HOLD });
          break;
        
        case BOOKING_STATUS.BOOKED:
          // BOOKED -> permanently hidden
          transaction.update(propertyRef, { status: PROPERTY_STATUS.BOOKED });
          break;
        
        case BOOKING_STATUS.REJECTED:
        case BOOKING_STATUS.CANCELLED:
          // Revert to AVAILABLE
          transaction.update(propertyRef, { status: PROPERTY_STATUS.AVAILABLE });
          break;
          
        default:
          // Other states don't change property visibility by default
          break;
      }
    }

    // 3. Trigger Notifications (Async after transaction)
    // We'll return the notification data to be sent after transaction succeeds
    const notifications = [];
    
    if (userId) {
      notifications.push({
        user_id: userId,
        role: 'tenant' as NotificationRole,
        type: 'booking' as NotificationType,
        title: `Booking Update: ${newStatus.replace('_', ' ').toUpperCase()}`,
        message: `Your booking for "${propertyTitle || 'Property'}" has been updated to ${newStatus.replace('_', ' ')}.`,
        metadata: { bookingId, propertyId, status: newStatus }
      });
    }

    if (ownerId) {
      notifications.push({
        user_id: ownerId,
        role: 'owner' as NotificationRole,
        type: 'booking' as NotificationType,
        title: `Booking Update: ${newStatus.replace('_', ' ').toUpperCase()}`,
        message: `Booking for your property "${propertyTitle || 'Property'}" has been updated to ${newStatus.replace('_', ' ')}.`,
        metadata: { bookingId, propertyId, status: newStatus }
      });
    }

    return {
      success: true,
      notifications
    };
  }).then(async (result) => {
    // Send notifications after transaction success
    if (result.notifications) {
      for (const notification of result.notifications) {
        if (notification) {
          await sendNotification(notification);
        }
      }
    }
    return result;
  });
}
