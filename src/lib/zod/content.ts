import { EContentTypeLowercase } from '@/types/content';
import { EContentType } from '@prisma/client';
import z from 'zod';

// ----------------------------------------------------------------

export const contentTypeSchema = z.object({
  type: z.nativeEnum(EContentTypeLowercase),
});

export const allContentQuerySchema = z.object({
  type: z.nativeEnum(EContentTypeLowercase),
  page: z.string().trim().optional(),
  limit: z.string().trim().optional(),
  viewerId: z
    .string()
    .trim()
    .uuid('ID must be unique and uuid')
    .length(36, 'ID must be exactly 36 characters long!'),
  sortBy: z.enum(['recent', 'popular', 'following', '']).optional(),
  tag: z.string().trim().optional(),
});

export const tagsTitleSchema = z.object({
  title: z.string().trim().optional(),
  limit: z.string().trim().optional(),
});

export const commentsSchema = z.object({
  id: z
    .string()
    .trim()
    .uuid('ID must be unique and uuid')
    .length(36, 'ID must be exactly 36 characters long!')
    .optional(),
  replyingToId: z
    .string()
    .trim()
    .uuid('ID must be unique and uuid')
    .length(36, 'ID must be exactly 36 characters long!')
    .optional(),
  text: z
    .string()
    .trim()
    .min(3, 'Comments must be at least 3 characters long!'),
  authorId: z
    .string()
    .trim()
    .uuid('Author ID must be unique and uuid')
    .length(36, 'Author ID must be exactly 36 characters long!'),
  contentId: z
    .string()
    .trim()
    .uuid('Content ID must be unique and uuid')
    .length(36, 'Content ID must be exactly 36 characters long!'),
});

export const likeCommentsSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
});

export const contentIdSchema = z.object({
  contentId: z.string(),
});

/***************************************************************** CREATE ***********************************************************/

const contentCreateBaseSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters long!'),
  groupId: z
    .string()
    .trim()
    .uuid('ID must be unique and uuid')
    .length(36, 'ID must be exactly 36 characters long!'),
  authorId: z
    .string()
    .trim()
    .uuid('ID must be unique and uuid')
    .length(36, 'ID must be exactly 36 characters long!'),
  description: z
    .string()
    .trim()
    .min(3, 'Description must be at least 3 characters long!'),
  coverImage: z.string().trim().url().nullable(),
  tags: z.array(z.string().min(1, 'Tag must be at least 1 character long!')),
});

export const postSchema = contentCreateBaseSchema.extend({
  type: z.literal(EContentType.POST),
});

export const meetupSchema = contentCreateBaseSchema.extend({
  type: z.literal(EContentType.MEETUP),
  meetupLocation: z.object({
    address: z
      .string()
      .trim()
      .min(1, 'Address must be at least 1 character long'),
    lat: z.number(),
    lng: z.number(),
  }),
  meetupDate: z.coerce.date({
    required_error: 'Date is required!',
    invalid_type_error: 'Invalid date format!',
  }),
});

export const podcastSchema = contentCreateBaseSchema.extend({
  type: z.literal(EContentType.PODCAST),
  podcastFile: z.string().trim().url('Please provide valid URL!'),
  podcastTitle: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters long!'),
});

/***************************************************************** CREATE ***********************************************************/

/***************************************************************** UPDATE ***********************************************************/

export const contentUpdateBaseSchema = contentCreateBaseSchema.omit({
  authorId: true,
});

export const updatePostSchema = contentUpdateBaseSchema.extend({});

export const updateMeetupSchema = contentUpdateBaseSchema.extend({
  meetupLocation: z.object({
    address: z
      .string()
      .trim()
      .min(1, 'Address must be at least 1 character long'),
    lat: z.number(),
    lng: z.number(),
  }),

  meetupDate: z.coerce.date({
    required_error: 'Date is required!',
    invalid_type_error: 'Invalid date format!',
  }),
});

export const updatePodcastSchema = contentUpdateBaseSchema.extend({
  podcastFile: z.string().trim().url('Please provide valid URL!'),
  podcastTitle: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters long!'),
});

export const getAllContentSidebarDetailsSchema = z.object({
  posts: z.literal('true').optional(),
  meetups: z.literal('true').optional(),
  podcasts: z.literal('true').optional(),
  type: z.nativeEnum(EContentTypeLowercase).optional(),
  viewerId: z
    .string()
    .trim()
    .uuid('ID must be unique and uuid')
    .length(36, 'ID must be exactly 36 characters long!'),
});
