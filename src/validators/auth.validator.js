import { z } from 'zod';

export const signUpSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required'),
    secondName: z.string().optional(),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const signInSchema = z.object({
  body: z.object({
    signInType: z.number().optional(),
    email: z.string().email('Invalid email address').optional(),
    username: z.string().optional(),
    password: z.string().min(1, 'Password is required'),
  }),
});
