import { EContentTypeLowercase } from '@/types/content';
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
  avatarImg: z.string().trim().optional().nullable(),
});

export const onboardingSchema = z.object({
  currentKnowledge: z.string().trim().min(1),
  codingAmbitions: z.array(z.string()).min(1),
  preferredSkills: z.array(z.string().max(17)).min(1),
  isOnboardingCompleted: z.boolean(),
});

export const paramsEmailSchema = z.object({
  email: z.string().trim().email(),
});

export const userIdSchema = z.object({
  userId: z
    .string()
    .trim()
    .uuid()
    .length(36, 'ID must be exactly 36 characters long!'),
});

export const profileSchema = z.object({
  userId: z.string().optional(),
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

export const getUserContentSchema = z.object({
  contentId: z.string(),
  authorId: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  viewsCount: z.number().optional(),
  likesCount: z.number().optional(),
  commentsCount: z.number().optional(),
  createdAt: z.date().optional(),
  podcastFile: z.string().optional(),
  podcastTitle: z.string().optional(),
});

export const getUserContentTypeSchema = z.object({
  type: z.nativeEnum(EContentTypeLowercase).optional(),
  page: z.string().trim().optional(),
  viewerId: z
    .string()
    .trim()
    .uuid('ID must be unique and uuid')
    .length(36, 'ID must be exactly 36 characters long!'),
  limit: z.string().trim().optional(),
});

export const getUserGroupSchema = z.object({
  page: z.string().optional(),
});

export const getAllUsersSchema = z.object({
  limit: z.string().trim().optional(),
  q: z.string().trim().optional(),
});
