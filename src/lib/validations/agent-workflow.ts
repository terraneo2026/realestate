import { z } from 'zod';

// 1. Agent KYC & Business Verification Schema
export const agentKYCSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  mobile: z.string().regex(/^[0-9]{10}$/, "Invalid mobile number"),
  email: z.string().email("Invalid email"),
  businessName: z.string().optional(),
  reraNumber: z.string().optional(),
  documents: z.object({
    aadhaarUpload: z.string().url("Aadhaar upload is required"),
    businessProof: z.string().url("Business proof is required"),
    selfiePhoto: z.string().url("Selfie photo is required"),
  }),
  kycStatus: z.enum(['pending_review', 'approved', 'rejected', 'suspended', 'blacklisted']).default('pending_review'),
  rejectionReason: z.string().optional(),
});

// 2. Agent Territory Schema
export const agentTerritorySchema = z.object({
  agentId: z.string(),
  city: z.string(),
  localities: z.array(z.string()).min(1, "At least one locality is required"),
  radiusKm: z.number().min(1).max(50).default(5),
  status: z.enum(['pending', 'active', 'restricted']).default('pending'),
});

// 3. Subscription & Credits
export const agentSubscriptionSchema = z.object({
  id: z.string().optional(),
  agentId: z.string(),
  package: z.enum(['silver', 'gold', 'platinum']),
  creditsPurchased: z.number().min(0),
  creditsUsed: z.number().default(0),
  creditsRemaining: z.number().min(0),
  creditsExpired: z.number().default(0),
  startDate: z.any(),
  expiryDate: z.any(),
  status: z.enum(['pending', 'active', 'expired', 'suspended']),
});

// 4. Property Lock Schema (15-day exclusive)
export const agentPropertyLockSchema = z.object({
  propertyId: z.string(),
  agentId: z.string(),
  lockedAt: z.any(),
  expiresAt: z.any(),
  status: z.enum(['active', 'expired', 'released', 'deal_closed']),
});

// 5. Owner Access Request
export const agentOwnerRequestSchema = z.object({
  propertyId: z.string(),
  ownerId: z.string(),
  agentId: z.string(),
  status: z.enum(['pending', 'approved', 'rejected', 'timeout']),
  requestDate: z.any(),
  responseDate: z.any().optional(),
});

// 6. Deal Tracking
export const agentDealTrackingSchema = z.object({
  propertyId: z.string(),
  agentId: z.string(),
  ownerId: z.string(),
  tenantId: z.string().optional(),
  status: z.enum(['tenant_interested', 'pending_confirmation', 'confirmed', 'rejected', 'deal_closed']),
  commissionDeclared: z.number().min(0).optional(),
  platformFeeReduced: z.boolean().default(true),
  closedAt: z.any().optional(),
});
