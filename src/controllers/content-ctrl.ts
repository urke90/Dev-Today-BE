import { prisma, Prisma } from '@/database/prisma-client';
import {
  createMeetupSchema,
  createPodcastSchema,
  createPostSchema,
  idSchema,
  updateMeetupSchema,
  updatePodcastSchema,
  updatePostSchema,
} from '@/lib/zod/content';
import type { Response } from 'express';
import type { TypedRequest, TypedRequestBody } from 'zod-express-middleware';

// ----------------------------------------------------------------

/***************************************************************** CREATE ********************************************************** */

export const createPost = async (
  req: TypedRequestBody<typeof createPostSchema>,
  res: Response
) => {
  const { description, groupId, title, type, coverImage, tags, authorId } =
    req.body;

  try {
    const post = await prisma.content.create({
      data: {
        title,
        type,
        description,
        coverImage,
        authorId,
        groupId,
        tags,
      },
    });

    res.status(201).json({ post });
  } catch (error) {
    console.log('Error creating post', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        res.status(400).json({ message: 'Invalid author or group ID' });
      }
    }
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const createMeetup = async (
  req: TypedRequestBody<typeof createMeetupSchema>,
  res: Response
) => {
  const {
    description,
    groupId,
    title,
    type,
    coverImage,
    tags,
    authorId,
    meetupDate,
    meetupLocation,
    meetupLocationImage,
  } = req.body;

  try {
    const meetup = await prisma.content.create({
      data: {
        title,
        type,
        description,
        coverImage,
        authorId,
        groupId,
        tags,
        meetupDate,
        meetupLocationImage,
        meetupLocation,
      },
    });

    res.status(201).json({ meetup });
  } catch (error) {
    console.log('Error creating meetup', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        res.status(400).json({ message: 'Invalid author or group ID' });
      }
    }
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const createPodcast = async (
  req: TypedRequestBody<typeof createPodcastSchema>,
  res: Response
) => {
  const {
    description,
    groupId,
    title,
    type,
    coverImage,
    tags,
    authorId,
    podcastFile,
    podcastTitle,
  } = req.body;

  try {
    const podcast = await prisma.content.create({
      data: {
        title,
        type,
        description,
        coverImage,
        authorId,
        groupId,
        tags,
        podcastFile,
        podcastTitle,
      },
    });

    res.status(201).json({ podcast });
  } catch (error) {
    console.log('Error creating podcast', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        res.status(400).json({ message: 'Invalid author or group ID' });
      }
    }
    res.status(500).json({ message: 'Internal server error!' });
  }
};

/***************************************************************** CREATE ***********************************************************/

/***************************************************************** UPDATE ***********************************************************/
export const updatePost = async (
  req: TypedRequest<typeof idSchema, any, typeof updatePostSchema>,
  res: Response
) => {
  const id = req.params.id;
  const { description, title, coverImage, tags } = req.body;

  try {
    const post = await prisma.content.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        coverImage,
        tags,
      },
    });
    console.log('post', post);

    res.status(201).json({ post });
  } catch (error) {
    console.log('Error updating post', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        res.status(400).json({ message: 'Invalid author or group ID' });
      }
    }
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const updateMeetup = async (
  req: TypedRequest<typeof idSchema, any, typeof updateMeetupSchema>,
  res: Response
) => {
  const id = req.params.id;
  const {
    description,
    title,
    coverImage,
    tags,
    meetupDate,
    meetupLocation,
    meetupLocationImage,
  } = req.body;

  console.log('meetup date', meetupDate);

  try {
    const meetup = await prisma.content.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        coverImage,
        tags,
        meetupDate,
        meetupLocationImage,
        meetupLocation,
      },
    });
    console.log('meetup', meetup);

    res.status(201).json({ meetup });
  } catch (error) {
    console.log('Error updating meetup', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        res.status(400).json({ message: 'Invalid author or group ID' });
      }
    }
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const updatePodcast = async (
  req: TypedRequest<typeof idSchema, any, typeof updatePodcastSchema>,
  res: Response
) => {
  const id = req.params.id;
  const { description, title, coverImage, tags, podcastFile, podcastTitle } =
    req.body;

  try {
    const podcast = await prisma.content.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        coverImage,
        tags,
        podcastFile,
        podcastTitle,
      },
    });
    console.log('content', podcast);

    res.status(201).json({ podcast });
  } catch (error) {
    console.log('Error updating podcast', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        res.status(400).json({ message: 'Invalid author or group ID' });
      }
    }
    res.status(500).json({ message: 'Internal server error!' });
  }
};

/***************************************************************** UPDATE ***********************************************************/
