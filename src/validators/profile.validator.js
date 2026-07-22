import { z } from 'zod';

export const profileSchema = z.object({
  body: z.object({
    age: z.union([z.string(), z.number()]).optional(),
    gender: z.string().optional(),
    weight: z.union([z.string(), z.number()]).optional(),
    Weight: z.union([z.string(), z.number()]).optional(),
    height: z.union([z.string(), z.number()]).optional(),
    Height: z.union([z.string(), z.number()]).optional(),
    fitnessGoal: z.string().optional(),
    FitnessGoal: z.string().optional(),
    experienceLevel: z.string().optional(),
    ExperienceLevel: z.string().optional(),
    injuries: z.string().optional(),
    Injuries: z.string().optional(),
  }),
});
