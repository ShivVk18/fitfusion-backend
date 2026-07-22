import { z } from 'zod';

export const recoverySchema = z.object({
  body: z.object({
    sleepHours: z.union([z.string(), z.number()]),
    soreness: z.union([z.string(), z.number()]),
    fatigue: z.union([z.string(), z.number()]),
    stress: z.union([z.string(), z.number()]),
    hydration: z.union([z.string(), z.number()]),
    date: z.string().optional(),
  }),
});

export default recoverySchema;
