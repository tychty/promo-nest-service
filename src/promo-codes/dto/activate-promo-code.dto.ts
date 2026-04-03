import { z } from 'zod';

export const ActivatePromoCodeSchema = z.object({
  email: z.string().email(),
});

export type ActivatePromoCodeDto = z.infer<typeof ActivatePromoCodeSchema>;
