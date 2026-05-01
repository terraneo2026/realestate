import { z } from 'zod';

export const userValidationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().regex(/^[0-9]{10}$/, "Mobile must be a 10-digit number"),
  role: z.enum(['tenant', 'owner', 'agent', 'admin', 'staff', 'manager']),
  kyc_status: z.enum(['unverified', 'pending', 'verified', 'rejected', 're-kyc']),
  accountStatus: z.enum(['active', 'suspended', 'deactivated']),
  occupation: z.string().optional(),
  address: z.string().optional(),
  packageType: z.string().optional(),
  assignedArea: z.string().optional(),
  city: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export type UserFormData = z.infer<typeof userValidationSchema>;
