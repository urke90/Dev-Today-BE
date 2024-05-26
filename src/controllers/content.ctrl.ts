import { prisma } from '@/database/prisma-client';
import { createContentSchema } from '@/lib/zod/content';
import type { Response } from 'express';
import type { TypedRequestBody } from 'zod-express-middleware';

// ----------------------------------------------------------------

export const createContent = async (
  req: TypedRequestBody<typeof createContentSchema>,
  res: Response
) => {
  const {
    description,
    groupdId,
    title,
    type,
    commentsCount,
    coverImage,
    likesCount,
    meetupDate,
    meetupLocation,
    podcastFile,
    podcastTitle,
    tags,
    viewsCount,
  } = req.body;

  try {
    const newContent = await prisma.content.create({
      data: {
        title,
        type,
        description,
      },
    });
  } catch (error) {
    console.log('Error creating content', error);
  }
};
