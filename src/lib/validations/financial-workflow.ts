import { z } from 'zod';

// 1. Financial Statuses
export const PAYMENT_STATUS = {
  INITIATED: 'INITIATED',
  PENDING: 'PENDING',
  ESCROW_HELD: 'ESCROW_HELD',
  PARTIALLY_RELEASED: 'PARTIALLY_RELEASED',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
  REVERSED: 'REVERSED',
  DISPUTED: 'DISPUTED',
} as const;

export type PaymentStatus = keyof typeof PAYMENT_STATUS;

// 2. Commission Rule Schema
export const commissionRuleSchema = z.object({
  id: z.string().optional(),
  deal_type: z.enum(['direct', 'agent']),
  property_category: z.string(), // e.g., budget, luxury
  tenant_commission_type: z.enum(['percentage', 'fixed']),
  tenant_commission_value: z.number().min(0),
  owner_commission_type: z.enum(['percentage', 'fixed']),
  owner_commission_value: z.number().min(0),
  tax_percentage: z.number().default(18),
  active_status: z.boolean().default(true),
});

// 3. Wallet Transaction Schema
export const walletTransactionSchema = z.object({
  id: z.string().optional(),
  wallet_id: z.string(),
  transaction_type: z.enum(['credit', 'debit']),
  amount: z.number().positive(),
  reference_id: z.string(),
  reference_type: z.enum(['token_refund', 'token_usage', 'manual_adjustment', 'cashback']),
  status: z.enum(['pending', 'completed', 'failed', 'reversed']),
  metadata: z.record(z.string(), z.any()).optional(),
  created_at: z.any(),
});

// 4. Escrow Transaction Schema
export const escrowTransactionSchema = z.object({
  id: z.string().optional(),
  booking_id: z.string(),
  tenant_id: z.string(),
  owner_id: z.string(),
  total_amount: z.number().positive(),
  held_amount: z.number().min(0),
  released_amount: z.number().min(0),
  commission_deducted: z.number().min(0),
  status: z.nativeEnum(PAYMENT_STATUS),
  created_at: z.any(),
  updated_at: z.any(),
});

// 5. Manual Payment Entry Schema (Maker-Checker)
export const manualPaymentEntrySchema = z.object({
  id: z.string().optional(),
  amount: z.number().positive(),
  payment_date: z.any(),
  payment_reference: z.string().min(1, "Reference ID required"),
  transaction_type: z.enum(['advance_rent', 'token', 'security_deposit']),
  property_deal_id: z.string(),
  notes: z.string().optional(),
  proof_url: z.string().url("Valid proof attachment required"),
  status: z.enum(['PENDING_APPROVAL', 'APPROVED', 'REJECTED']).default('PENDING_APPROVAL'),
  created_by: z.string(), // Staff A
  approved_by: z.string().optional(), // Staff B or Admin
  rejection_reason: z.string().optional(),
  created_at: z.any(),
});

// 6. Financial Ledger Schema (Immutable)
export const financialLedgerSchema = z.object({
  id: z.string().optional(),
  transaction_id: z.string(),
  transaction_type: z.string(),
  debit_account: z.string(), // e.g., 'TENANT_WALLET', 'ESCROW', 'PLATFORM_REVENUE'
  credit_account: z.string(),
  amount: z.number().positive(),
  currency: z.string().default('INR'),
  status: z.enum(['posted', 'reversed']),
  metadata: z.record(z.string(), z.any()).optional(),
  created_at: z.any(),
});
