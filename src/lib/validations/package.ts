import { z } from 'zod';

export const packageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  price: z.number().min(0, "Price cannot be negative"),
  duration: z.number().min(1, "Duration must be at least 1 day"),
  listingLimit: z.number().min(1, "Listing limit must be at least 1"),
  features: z.array(z.string()),
});

export type PackageFormData = z.infer<typeof packageSchema>;
