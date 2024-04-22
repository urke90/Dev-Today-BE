import z from 'zod';

export const registerSchema = z.object({
  userName: z.string().min(3, 'User name must be at least 3 characters long!'),
  email: z.string().trim().email('Please provide valid email address!'),
  password: z
    .string()
    .trim()
    .min(6, 'Password must be at least 6 characters long!'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Please provide valid email address!'),
  password: z
    .string()
    .trim()
    .min(6, 'Password must be at least 6 characters long!'),
});

export const loginProviderSchema = z.object({
  email: z.string().trim().email('Please provide valid email address!'),
});
