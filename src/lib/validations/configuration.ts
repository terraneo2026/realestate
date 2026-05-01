import { z } from 'zod';

// 1. Token Configuration Schema
export const tokenConfigSchema = z.object({
  id: z.string().optional(),
  category: z.enum(['Budget', 'Mid Range', 'Premium', 'Luxury']),
  tokenAmount: z.number().min(0, "Amount must be a positive number"),
  active: z.boolean().default(true),
  updatedBy: z.string().optional(),
  updatedAt: z.any().optional(), // Firestore timestamp
});

export type TokenConfig = z.infer<typeof tokenConfigSchema>;

// 2. Commission Configuration Schema
export const commissionConfigSchema = z.object({
  id: z.string().optional(),
  side: z.enum(['tenant', 'owner_direct', 'owner_agent']),
  type: z.enum(['fixed', 'percentage', 'per_day']),
  value: z.number().min(0, "Value must be positive").superRefine((val, ctx) => {
    // Custom validation logic based on type could be added here if needed,
    // but we'll handle it in the form or specific sub-schemas if complex.
  }),
  active: z.boolean().default(true),
  effectiveFrom: z.string().or(z.date()),
  remarks: z.string().optional(),
  updatedBy: z.string().optional(),
  updatedAt: z.any().optional(),
});

export type CommissionConfig = z.infer<typeof commissionConfigSchema>;

// 3. Property Fee Rules Schema (for Property-level overrides)
export const propertyFeeRulesSchema = z.object({
  tokenEnabled: z.boolean().default(true),
  commissionEnabled: z.boolean().default(true),
  commissionTarget: z.enum(['tenant', 'owner', 'both']).default('both'),
  overrideTokenAmount: z.number().min(0).optional(),
  overrideCommission: z.number().min(0).optional(),
  updatedBy: z.string().optional(),
  updatedAt: z.any().optional(),
});

export type PropertyFeeRules = z.infer<typeof propertyFeeRulesSchema>;

// 4. Agent Package Configuration Schema
export const agentPackageSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.number().min(0, "Price must be positive"),
  credits: z.number().int().min(1, "Credits must be at least 1"),
  expiryDuration: z.number().int().min(1, "Expiry duration must be at least 1 day"),
  active: z.boolean().default(true),
  features: z.array(z.string()).default([]),
  sortOrder: z.number().int().default(0),
  updatedBy: z.string().optional(),
  updatedAt: z.any().optional(),
});

export type AgentPackage = z.infer<typeof agentPackageSchema>;

// 5. Credit Expiry Rules Schema
export const creditExpiryRulesSchema = z.object({
  id: z.string().optional(),
  policyName: z.string().min(2),
  durationDays: z.number().int().min(1),
  active: z.boolean().default(true),
  updatedBy: z.string().optional(),
  updatedAt: z.any().optional(),
});

export type CreditExpiryRule = z.infer<typeof creditExpiryRulesSchema>;

// 6. Agent Territory Radius Schema
export const agentRadiusSchema = z.object({
  id: z.string().optional(),
  radiusKm: z.number().min(1, "Radius must be at least 1 KM"),
  areaRestrictions: z.array(z.string()).default([]),
  cityRestrictions: z.array(z.string()).default([]),
  premiumOverride: z.boolean().default(false),
  updatedBy: z.string().optional(),
  updatedAt: z.any().optional(),
});

export type AgentRadiusConfig = z.infer<typeof agentRadiusSchema>;

// 7. Global Business Rules Schema
export const globalBusinessRulesSchema = z.object({
  id: z.string().optional(),
  ruleKey: z.string(),
  ruleValue: z.any(),
  description: z.string().optional(),
  active: z.boolean().default(true),
  updatedBy: z.string().optional(),
  updatedAt: z.any().optional(),
});

export type GlobalBusinessRule = z.infer<typeof globalBusinessRulesSchema>;

// 8. Audit Log Schema
export const auditLogSchema = z.object({
  id: z.string().optional(),
  adminId: z.string(),
  adminName: z.string().optional(),
  module: z.string(),
  action: z.enum(['CREATE', 'UPDATE', 'DELETE', 'TOGGLE']),
  oldValue: z.any().optional(),
  newValue: z.any().optional(),
  ipAddress: z.string().optional(),
  deviceInfo: z.string().optional(),
  timestamp: z.any(),
});

export type AuditLog = z.infer<typeof auditLogSchema>;
