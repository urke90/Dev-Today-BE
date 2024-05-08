import { link } from 'fs';
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
  id: z.string().trim().length(36),
});

export const paramsEmailSchema = z.object({
  email: z.string().trim().email(),
});

export const profileSchema = z.object({
  userId: z.string(),
  userName: z.string().optional(),
  name: z.string().optional().optional(),
  email: z
    .string({ required_error: 'Email is required!' })
    .trim()
    .email('Please provide valid email address!')
    .optional(),
  preferredSkills: z.array(z.string()).optional(),
  contents: z.array(z.string()).optional(),
  likedContents: z.array(z.string()).optional(),
  bio: z.string().optional(),
  avatarImg: z.string().optional(),
  createdAt: z.date().optional(),
  instagramName: z.string().optional(),
  instagramLink: z.string().optional(),
  linkedinName: z.string().optional(),
  linkedinLink: z.string().optional(),
  twitterName: z.string().optional(),
  twitterLink: z.string().optional(),
  followers: z.number().optional(),
  following: z.number().optional(),
});

export const contentSchema = z.object({
  contentId: z.string(),
  authorId: z.string().optional(),
  title: z.string().optional(),
  contentDescription: z.string().optional(),
  storyTags: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  viewsCount: z.number().optional(),
  likesCount: z.number().optional(),
  commentsCount: z.number().optional(),
  createdAt: z.date().optional(),
  podcastAudioFile: z.string().optional(),
  podcastAudioTitle: z.string().optional(),
});

export const typeSchema = z.object({
  type: z.enum(['POSTS', 'MEETUP', 'PODCAST', 'GROUPS']).optional(),
  page: z.coerce.number().default(1).optional(),
});
