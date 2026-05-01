import { z } from 'zod';

// 1. Staff Roles
export const STAFF_ROLES = {
  FIELD_VERIFICATION_STAFF: 'FIELD_VERIFICATION_STAFF',
  VISIT_ESCORT_STAFF: 'VISIT_ESCORT_STAFF',
  DISPUTE_RESOLUTION_STAFF: 'DISPUTE_RESOLUTION_STAFF',
  SUPPORT_STAFF: 'SUPPORT_STAFF',
} as const;

export type StaffRole = keyof typeof STAFF_ROLES;

// 2. Staff Profile Schema
export const staffProfileSchema = z.object({
  id: z.string().optional(),
  auth_user_id: z.string(),
  full_name: z.string().min(2, "Full name is required"),
  phone: z.string().regex(/^[0-9]{10}$/, "Invalid phone number"),
  role: z.enum(['FIELD_VERIFICATION_STAFF', 'VISIT_ESCORT_STAFF', 'DISPUTE_RESOLUTION_STAFF', 'SUPPORT_STAFF']),
  status: z.enum(['active', 'inactive', 'suspended', 'on_leave']).default('active'),
  performance_score: z.number().min(0).max(100).default(100),
  created_at: z.any(),
});

// 3. Staff Assignment Schema
export const staffAssignmentSchema = z.object({
  id: z.string().optional(),
  staff_id: z.string(),
  property_id: z.string(),
  assignment_type: z.enum(['verification', 'visit_escort', 'dispute', 'support']),
  assigned_by: z.string(), // admin id
  assigned_at: z.any(),
  status: z.enum(['pending', 'in_progress', 'completed', 'failed', 'cancelled']).default('pending'),
  deadline: z.any().optional(),
});

// 4. Verification Report Schema
export const verificationReportSchema = z.object({
  id: z.string().optional(),
  property_id: z.string(),
  staff_id: z.string(),
  visit_time: z.any(),
  latitude: z.number(),
  longitude: z.number(),
  report_notes: z.string().min(10, "Detailed notes required"),
  approval_status: z.enum(['approved', 'rejected', 'review_required']),
  media_urls: z.array(z.string().url()).min(3, "At least 3 property photos required"),
  document_status: z.enum(['verified', 'missing', 'fraudulent']),
  created_at: z.any(),
});

// 5. Visit Escort Log Schema
export const visitEscortLogSchema = z.object({
  id: z.string().optional(),
  visit_request_id: z.string(),
  staff_id: z.string(),
  checkin_time: z.any().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  visit_status: z.enum(['scheduled', 'checked_in', 'completed', 'no_show', 'failed']),
  tenant_decision: z.enum(['interested', 'not_interested', 'pending']).optional(),
  report_notes: z.string().optional(),
  created_at: z.any(),
});

// 6. Support Ticket Schema
export const supportTicketSchema = z.object({
  id: z.string().optional(),
  user_id: z.string(),
  assigned_staff_id: z.string().optional(),
  category: z.enum(['payment', 'property', 'technical', 'fraud', 'other']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed', 'escalated']),
  escalation_level: z.number().min(0).max(2).default(0), // 0: support, 1: dispute, 2: admin
  created_at: z.any(),
});

// 7. Staff Activity Log Schema
export const staffActivityLogSchema = z.object({
  id: z.string().optional(),
  staff_id: z.string(),
  action_type: z.string(),
  entity_type: z.string(),
  entity_id: z.string(),
  metadata: z.any().optional(),
  ip_address: z.string().optional(),
  created_at: z.any(),
});
