import z from 'zod';

export const registerSchema = z.object({
  userName: z
    .string({ required_error: 'Username is required!' })
    .min(3, 'User name must be at least 3 characters long!'),
  email: z
    .string({ required_error: 'Email is required!' })
    .trim()
    .email('Please provide valid email address!'),
  password: z
    .string({ required_error: 'Password is required!' })
    .trim()
    .min(6, 'Password must be at least 6 characters long!'),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required!' })
    .trim()
    .email('Please provide valid email address!'),
  password: z
    .string({ required_error: 'Password is required!' })
    .trim()
    .min(6, 'Password must be at least 6 characters long!'),
});

export const loginProviderSchema = z.object({
  email: z
    .string({ required_error: 'Email is required!' })
    .trim()
    .email('Please provide valid email address!'),
  name: z.string().trim(),
  avatarImg: z.string().trim(),
});

export const onboardingSchema = z.object({
  currentKnowledge: z.string().trim().min(1),
  codingAmbitions: z.array(z.string()).min(1),
  preferredSkills: z.array(z.string().max(17)).min(1),
  isOnboardingCompleted: z.boolean(),
});

export const paramsIdSchema = z.object({
  id: z.string().trim().min(1),
});

export const paramsEmailSchema = z.object({
  email: z.string().trim().email(),
});
