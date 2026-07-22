import { z } from 'zod';

export const dietSchema = z.object({
  body: z.object({
    calories: z.union([z.string(), z.number()]),
    protein: z.union([z.string(), z.number()]).optional(),
    protien: z.union([z.string(), z.number()]).optional(),
    carbs: z.union([z.string(), z.number()]).optional(),
    fats: z.union([z.string(), z.number()]).optional(),
    diet_type: z.string().optional(),
    dietType: z.string().optional(),
    goal: z.string().optional(),
    meals: z.array(z.any()).optional(),
    mealTimings: z.array(z.any()).optional(),
    date: z.string().optional(),
  }),
});

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
