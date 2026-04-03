import { z } from 'zod';

export const CreatePromoCodeSchema = z.object({
  code: z.string().min(1).max(100),
  discountPercent: z.number().int().min(1).max(100),
  activationLimit: z.number().int().min(0),
  expiresAt: z.iso.datetime().optional(),
});

export type CreatePromoCodeDto = z.infer<typeof CreatePromoCodeSchema>;
