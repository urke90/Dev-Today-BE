import { EContentTypeLowercase } from '@/types/content';
import { Role } from '@prisma/client';
import z from 'zod';

// ----------------------------------------------------------------

const membersSchema = z.object({
  userId: z
    .string()
    .trim()
    .uuid('User ID must be unique and uuid')
    .length(36, 'Author ID must have 36 characters exactly'),
  role: z.nativeEnum(Role),
});

export const getAllGroupsSchema = z.object({
  page: z.string().trim().optional(),
  q: z.string().trim().optional(),
  members: z.literal('true').optional(),
  limit: z.string().trim().optional(),
  sortBy: z.enum(['recent', 'popular', 'joined']).optional(),
  viewerId: z
    .string()
    .trim()
    .uuid('Author ID must be unique and uuid')
    .length(36, 'Author ID must have 36 characters exactly')
    .optional(),
});

/************************************************************ GROUP *******************************************************************/

export const createGroupSchema = z.object({
  authorId: z
    .string()
    .trim()
    .uuid('Author ID must be unique and uuid')
    .length(36, 'Author ID must have 36 characters exactly'),
  name: z
    .string()
    .trim()
    .min(1, 'Group name must be at least 1 character long!'),
  profileImage: z
    .string()
    .trim()
    .url('Please provide valid cover image url!')
    .nullable(),
  coverImage: z
    .string()
    .trim()
    .url('Please provide valid cover image url!')
    .nullable(),
  bio: z.string().trim().min(3, 'Bio must be at least 1 character long!'),
  members: z.array(membersSchema).optional(),
});

export const updateGroupSchema = createGroupSchema.omit({
  members: true,
});

/************************************************************ GROUP *******************************************************************/

export const getGroupByIdSchema = z.object({
  viewerId: z
    .string()
    .trim()
    .uuid('Not valida UUID')
    .length(36, 'User ID must be at least 36 characters long')
    .optional(),
  members: z.literal('true').optional(),
  stats: z.literal('true').optional(),
  meetups: z.literal('true').optional(),
  topRankedGroups: z.literal('true').optional(),
});

export const getAllGroupsSidbarDetailsSchema = z.object({
  filter: z.enum(['newest', 'popular', 'joined']).optional(),
});

export const getGroupMembersSchema = z.object({
  role: z.enum(['user', 'admin']).optional(),
  page: z.string().trim().optional(),
  limit: z.string().trim().optional(),
});

export const getGroupContentSchema = z.object({
  type: z.nativeEnum(EContentTypeLowercase),
  limit: z.string().trim().optional(),
  page: z.string().trim().optional(),
  viewerId: z
    .string()
    .trim()
    .uuid('Not valid UUID')
    .length(36, 'User ID must be at least 36 characters long'),
});

export const joinOrLeaveGroupSchema = z.object({
  viewerId: z
    .string()
    .trim()
    .uuid('Not valid UUID')
    .length(36, 'User ID must be at least 36 characters long'),
});

export const groupMemebersActionsSchema = z.object({
  viewerId: z
    .string()
    .trim()
    .uuid('Not valid UUID')
    .length(36, 'User ID must be at least 36 characters long'),
  userId: z
    .string()
    .trim()
    .uuid('Not valid UUID')
    .length(36, 'User ID must be at least 36 characters long'),
});
