import { z } from 'zod';

// 1. Tenant KYC Schema
export const tenantKYCSchema = z.object({
  profession: z.string().min(2, "Profession is required"),
  companyName: z.string().min(2, "Company name is required"),
  monthlyIncome: z.string().min(1, "Income range is required"),
  familySize: z.number().min(1, "Family size must be at least 1"),
  employmentType: z.enum(['salaried', 'self_employed', 'business', 'student']),
  aadhaarNumber: z.string().regex(/^[0-9]{12}$/, "Invalid Aadhaar number"),
  documents: z.object({
    aadhaarUpload: z.string().url("Aadhaar upload is required"),
    salaryProof: z.string().url().optional(),
  }),
  kycStatus: z.enum(['pending', 'under_review', 'approved', 'rejected']).default('pending'),
  rejectionReason: z.string().optional(),
});

// 2. Token Statuses
export const TOKEN_STATUS = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  REFUNDED: 'refunded',
  FORFEITED: 'forfeited',
  WALLET_CREDITED: 'wallet_credited',
} as const;

// 3. Visit Request Schema & Statuses
export const VISIT_REQUEST_STATUS = {
  PENDING_OWNER_REVIEW: 'pending_owner_review',
  OWNER_ACCEPTED: 'owner_accepted',
  OWNER_REJECTED: 'owner_rejected',
  AUTO_EXPIRED: 'auto_expired',
  VISIT_SCHEDULED: 'visit_scheduled',
  COMPLETED: 'completed',
  NO_SHOW: 'no_show',
  TENANT_DECLINED: 'tenant_declined',
  LOCKED_FOR_AGREEMENT: 'locked_for_agreement',
} as const;

export type VisitRequestStatus = typeof VISIT_REQUEST_STATUS[keyof typeof VISIT_REQUEST_STATUS];

// 4. Rent Payment Schema
export const rentPaymentSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string(),
  ownerId: z.string(),
  propertyId: z.string(),
  bookingId: z.string(),
  amount: z.number().min(0),
  month: z.number().min(1).max(12),
  year: z.number(),
  dueDate: z.any(),
  status: z.enum(['pending', 'paid', 'overdue', 'escalated', 'legal_notice']),
  paidAt: z.any().optional(),
  transactionId: z.string().optional(),
  receiptUrl: z.string().url().optional(),
});

// 5. Tenant Wallet Schema
export const tenantWalletSchema = z.object({
  userId: z.string(),
  balance: z.number().default(0),
  transactions: z.array(z.object({
    type: z.enum(['credit', 'debit']),
    amount: z.number(),
    reason: z.string(),
    timestamp: z.any(),
    referenceId: z.string().optional(),
  })).default([]),
});

// 6. Cooling Period Schema
export const coolingPeriodSchema = z.object({
  tenantId: z.string(),
  propertyId: z.string(),
  expiryDate: z.any(),
  reason: z.string().default('tenant_rejected_property'),
});
