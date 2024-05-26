import { EContentType } from '@prisma/client';
import z from 'zod';

// ----------------------------------------------------------------

/**
 * ! COMMON
 * 1. title: string; DA
 * 2. type: 'posts'| 'meetups' | 'podcasts'; DA
 * 3. groupId: id DA
 * 4. coverImage: string;
 * 5. description: string;
 * 6. tags: string[];
 */

/**
 * ! SPECIFIC
 * 1. meetupLocation: string
 * ! 2.  meetupCordinates ===> yet to see { lat: number, lng: number }???
 * 3. meetupDate: Date
 * 4. podcastFile : File ===> just url to the cloudinary file
 * 5. podcastTitle: string
 * 6. viewsCount: number;
 * 7. likesCount: number;
 * 8. commentsCount: number;
 * 9. comments: IContent
 */

export const createContentSchema = z.object({
  // id: z
  //   .string()
  //   .trim()
  //   .uuid('ID must be unique and uuid')
  //   .length(36, 'ID must be exactly 36 characters long!'),
  title: z.string().trim().min(2, 'Title must be at least 2 characters long!'),
  type: z.enum([EContentType.posts, EContentType.meetups, EContentType.posts]),
  groupdId: z
    .string()
    .trim()
    .uuid()
    .length(36, 'ID must be exactly 36 characters long!'),
  coverImage: z.string().trim().optional(),
  description: z
    .string()
    .trim()
    .min(3, 'Description must be at least 3 characters long!'),
  tags: z
    .array(z.string().min(1, 'Tag must be at least 1 character long!'))
    .optional(),
  // comments: ,
  meetupLocation: z
    .string()
    .trim()
    .min(1, 'Location must be at least')
    .optional(),
  meetupDate: z.string().trim().date('Meetup Date is required!').optional(),
  podcastFile: z.string().trim().url('Please provide valid URL!').optional(),
  podcastTitle: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters long!')
    .optional(),
  viewsCount: z.number().optional(),
  likesCount: z.number().optional(),
  commentsCount: z.number().optional(),
});

// comments

export const commentsSchema = z.object({
  id: z
    .string()
    .trim()
    .uuid('ID must be unique and uuid')
    .length(36, 'ID must be exactly 36 characters long!'),
  text: z
    .string()
    .trim()
    .min(3, 'Comments must be at least 3 characters long!'),
  createdAt: z.string().date('Created at date is required!'),
  updatedAt: z.string().date('Updated at date is required!'),
  authorId: z
    .string()
    .trim()
    .uuid('ID must be unique and uuid')
    .length(36, 'ID must be exactly 36 characters long!'),
  contentId: z
    .string()
    .trim()
    .uuid('ID must be unique and uuid')
    .length(36, 'ID must be exactly 36 characters long!'),
});
