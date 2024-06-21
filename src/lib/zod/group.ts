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

export const groupDropdownSchema = z.object({
  name: z.string().trim().optional(),
});

export const getAllGroupsSchema = z.object({
  page: z.coerce.number().optional(),
  q: z.string().trim().optional(),
  members: z.literal('true').optional(),
  limit: z.coerce.number().optional(),
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
    .optional(),
  coverImage: z
    .string()
    .trim()
    .url('Please provide valid cover image url!')
    .optional(),
  bio: z.string().trim().min(1, 'Bio must be at least 1 character long!'),
  members: z.array(membersSchema).optional(),
});

export const updateGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Group name must be at least 1 character long!')
    .optional(),
  profileImage: z
    .string()
    .trim()
    .url('Please provide valid cover image url!')
    .optional(),
  coverImage: z
    .string()
    .trim()
    .url('Please provide valid cover image url!')
    .optional(),
  bio: z
    .string()
    .trim()
    .min(1, 'Bio must be at least 1 character long!')
    .optional(),
  members: z
    .array(membersSchema)
    .min(1, 'Group must have at least one member!')
    .optional(),
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
  page: z.string().trim().optional(),
  limit: z.string().trim().optional(),
});
