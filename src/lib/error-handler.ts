import { toast } from 'sonner';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AppError extends Error {
  code?: string;
  severity?: ErrorSeverity;
  context?: Record<string, any>;
}

/**
 * Senior Architect Centralized Error Handler
 * Handles logging and user notification for all errors.
 */
export const handleError = (error: any, severity: ErrorSeverity = 'medium', context?: Record<string, any>) => {
  // 1. Log to console in a structured format
  console.group(`[ERROR] ${severity.toUpperCase()}: ${error.message || 'Unknown Error'}`);
  console.error('Error Object:', error);
  if (context) console.info('Context:', context);
  console.groupEnd();

  // 2. In production, you would send this to a service like Sentry or LogRocket
  // Example: Sentry.captureException(error, { extra: context, level: severity });

  // 3. Notify the user with a friendly message
  const userMessage = getFriendlyMessage(error);
  
  switch (severity) {
    case 'critical':
      toast.error(`Critical Error: ${userMessage}. Please contact support immediately.`, { duration: 10000 });
      break;
    case 'high':
      toast.error(`Error: ${userMessage}. We have been notified.`);
      break;
    default:
      toast.error(userMessage);
      break;
  }
};

const getFriendlyMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  
  const code = error.code || '';
  const message = error.message || '';

  // Firebase Auth Errors
  if (code.includes('auth/')) {
    switch (code) {
      case 'auth/user-not-found': return 'User not found. Please check your email.';
      case 'auth/wrong-password': return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use': return 'This email is already registered.';
      case 'auth/weak-password': return 'Password is too weak. Use at least 6 characters.';
      case 'auth/network-request-failed': return 'Network error. Please check your connection.';
      default: return 'Authentication failed. Please try again.';
    }
  }

  // Firestore Errors
  if (code.includes('permission-denied')) {
    return "You don't have permission to perform this action.";
  }

  // Zod / Validation Errors
  if (error.name === 'ZodError') {
    return "Validation failed. Please check the form fields.";
  }

  return message || 'An unexpected error occurred. Please try again.';
};
