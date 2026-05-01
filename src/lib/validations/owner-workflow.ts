import { z } from 'zod';

// 1. Owner KYC Schema
export const ownerKYCSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  mobile: z.string().regex(/^[0-9]{10}$/, "Invalid mobile number"),
  email: z.string().email("Invalid email"),
  address: z.string().min(10, "Full address is required"),
  aadhaarNumber: z.string().regex(/^[0-9]{12}$/, "Invalid Aadhaar number"),
  documents: z.object({
    aadhaarFront: z.string().url("Aadhaar front is required"),
    aadhaarBack: z.string().url("Aadhaar back is required"),
    ownershipProof: z.string().url("Ownership proof is required"),
    proofType: z.enum(['sale_deed', 'eb_bill', 'tax_receipt', 'encumbrance_proof']),
  }),
  kycStatus: z.enum(['pending', 'verified', 'rejected']).default('pending'),
  rejectionReason: z.string().optional(),
});

// 2. Property Verification Workflow Statuses
export const PROPERTY_WORKFLOW_STATUS = {
  DRAFT: 'draft',
  PENDING_VERIFICATION: 'pending_verification',
  STAFF1_ASSIGNED: 'staff1_assigned',
  STAFF1_COMPLETED: 'staff1_completed',
  STAFF2_ASSIGNED: 'staff2_assigned',
  STAFF2_COMPLETED: 'staff2_completed',
  CONFLICT_REVIEW: 'conflict_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  LIVE: 'live',
  UNAVAILABLE: 'unavailable',
} as const;

export type PropertyWorkflowStatus = typeof PROPERTY_WORKFLOW_STATUS[keyof typeof PROPERTY_WORKFLOW_STATUS];

// 3. Staff Verification Report Schema
export const staffVerificationReportSchema = z.object({
  staffId: z.string(),
  propertyId: z.string(),
  visitProofUrl: z.string().url(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    geotagged: z.boolean(),
  }),
  conditionRating: z.number().min(1).max(5),
  isOwnerVerified: z.boolean(),
  isOccupancyVerified: z.boolean(),
  fraudIndicators: z.array(z.string()).default([]),
  comments: z.string().min(10),
  recommendation: z.enum(['approve', 'reject', 'review']),
  submittedAt: z.any(), // Firestore Timestamp
});

// 4. Visit Request Statuses
export const VISIT_REQUEST_STATUS = {
  PENDING_OWNER_REVIEW: 'pending_owner_review',
  OWNER_ACCEPTED: 'owner_accepted',
  OWNER_REJECTED: 'owner_rejected',
  REFUNDED: 'refunded',
  VISIT_SCHEDULED: 'visit_scheduled',
  VISIT_COMPLETED: 'visit_completed',
  EXPIRED: 'expired',
} as const;

export type VisitRequestStatus = typeof VISIT_REQUEST_STATUS[keyof typeof VISIT_REQUEST_STATUS];

// 5. Escrow Payment Schema
export const escrowPaymentSchema = z.object({
  bookingId: z.string(),
  tenantId: z.string(),
  ownerId: z.string(),
  amounts: z.object({
    monthlyRent: z.number().min(0),
    advanceAmount: z.number().min(0),
    gst: z.number().min(0),
    platformFee: z.number().min(0),
    ownerPayout: z.number().min(0),
  }),
  status: z.enum(['pending', 'paid', 'released', 'failed', 'refunded']),
  payoutStatus: z.enum(['pending', 'processing', 'settled', 'failed']).default('pending'),
  gatewayRef: z.string().optional(),
  payoutId: z.string().optional(),
  settlementDate: z.any().optional(),
  createdAt: z.any(),
});

// 6. Fraud/Bypass Flags
export const fraudFlagSchema = z.object({
  userId: z.string(),
  type: z.enum(['contact_bypass', 'external_payment', 'suspicious_activity', 'fake_listing']),
  severity: z.enum(['low', 'medium', 'high']),
  description: z.string(),
  metadata: z.any().optional(),
  timestamp: z.any(),
});
