import { z } from 'zod';

// 1. Edge Case Event Types
export const EDGE_CASE_TYPE = {
  FAKE_LISTING: 'FAKE_LISTING',
  BYPASS_ATTEMPT: 'BYPASS_ATTEMPT',
  OWNER_CANCEL_AFTER_PAYMENT: 'OWNER_CANCEL_AFTER_PAYMENT',
  RENT_HIKE_ATTEMPT: 'RENT_HIKE_ATTEMPT',
  TENANT_NO_SHOW: 'TENANT_NO_SHOW',
  AGENT_DATA_LEAK: 'AGENT_DATA_LEAK',
  STAFF_CORRUPTION_SUSPECTED: 'STAFF_CORRUPTION_SUSPECTED',
} as const;

// 2. Enforcement Action Types
export const ENFORCEMENT_ACTION = {
  SUSPEND_LISTING: 'SUSPEND_LISTING',
  BLOCK_ACCOUNT: 'BLOCK_ACCOUNT',
  PENALTY_FEE: 'PENALTY_FEE',
  BLACKLIST_IDENTITY: 'BLACKLIST_IDENTITY',
  RELIABILITY_SCORE_DECREASE: 'RELIABILITY_SCORE_DECREASE',
} as const;

// 3. Dispute Statuses
export const DISPUTE_STATUS = {
  OPEN: 'OPEN',
  UNDER_INVESTIGATION: 'UNDER_INVESTIGATION',
  RESOLVED: 'RESOLVED',
  ESCALATED_TO_ADMIN: 'ESCALATED_TO_ADMIN',
  CLOSED: 'CLOSED',
} as const;

// --- SCHEMAS ---

export const edgeCaseEventSchema = z.object({
  id: z.string().optional(),
  type: z.nativeEnum(EDGE_CASE_TYPE),
  entity_type: z.enum(['property', 'user', 'booking', 'transaction']),
  entity_id: z.string(),
  actor_id: z.string(),
  risk_score: z.number().min(0).max(100),
  metadata: z.record(z.string(), z.any()).optional(),
  created_at: z.any(),
});

export const enforcementActionSchema = z.object({
  id: z.string().optional(),
  event_id: z.string(),
  action_type: z.nativeEnum(ENFORCEMENT_ACTION),
  target_id: z.string(),
  reason: z.string().min(10, "Reason must be descriptive"),
  automated: z.boolean().default(true),
  applied_by: z.string(), // system or admin_id
  expires_at: z.any().optional(),
  created_at: z.any(),
});

export const disputeCaseSchema = z.object({
  id: z.string().optional(),
  category: z.string(),
  title: z.string().min(5),
  description: z.string().min(20),
  status: z.nativeEnum(DISPUTE_STATUS),
  raised_by: z.string(),
  assigned_to: z.string().optional(),
  evidence_urls: z.array(z.string().url()).default([]),
  resolution_notes: z.string().optional(),
  created_at: z.any(),
  updated_at: z.any(),
});

export const riskFlagSchema = z.object({
  user_id: z.string(),
  risk_level: z.enum(['low', 'medium', 'high', 'critical']),
  active_flags: z.array(z.string()),
  violation_count: z.number().default(0),
  last_flagged_at: z.any(),
});

export const auditLogSchema = z.object({
  id: z.string().optional(),
  actor_id: z.string(),
  actor_role: z.string(),
  action: z.string(),
  entity_type: z.string(),
  entity_id: z.string(),
  before_value: z.any().optional(),
  after_value: z.any().optional(),
  ip_address: z.string().optional(),
  device_info: z.any().optional(),
  created_at: z.any(),
});
