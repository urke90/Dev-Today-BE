import z from 'zod';

// ----------------------------------------------------------------

export const idSchema = z.object({
  id: z
    .string()
    .trim()
    .uuid('ID must be unique and uuid')
    .length(36, 'ID must be exactly 36 characters long!'),
});

export const pageNumberSchema = z.object({
  page: z.coerce.number().default(1).optional(),
});

export const viewerIdSchema = z.object({
  viewerId: z
    .string()
    .trim()
    .uuid('ID must be unique and uuid')
    .length(36, 'ID must be exactly 36 characters long!'),
});

export const searchQuerySchema = z.object({
  q: z.string().trim().optional(),
});
