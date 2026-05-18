import { z } from 'zod';

export const signupSchema = z.object({
 name: z.string().regex(/^[A-Za-z\s]+$/, 'Name must contain only alphabets and spaces'),
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  role: z.enum(['author', 'reader']),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
