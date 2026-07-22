import { z } from 'zod';

export const generateWorkoutSchema = z.object({
  body: z.object({
    DaysPerWeek: z.number().min(1).max(7).optional().default(4),
    daysPerWeek: z.number().min(1).max(7).optional(),
  }),
});

export const logWorkoutSchema = z.object({
  body: z.object({
    workoutId: z.string().optional(),
    exercise: z.array(z.any()).optional(),
    exercises: z.array(z.any()).optional(),
    duration: z.string().optional(),
    date: z.string().optional(),
    notes: z.string().optional(),
  }),
});
