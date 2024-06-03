import { idSchema } from '@/lib/zod/common';
import {
  allContentQuerySchema,
  createMeetupSchema,
  createPodcastSchema,
  createPostSchema,
  updateMeetupSchema,
  updatePodcastSchema,
  updatePostSchema,
} from '@/lib/zod/content';
import type { Request, Response } from 'express';
import type {
  TypedRequest,
  TypedRequestBody,
  TypedRequestQuery,
} from 'zod-express-middleware';

import { prisma, Prisma } from '@/database/prisma-client';
import { EContentType } from '@prisma/client';

// ----------------------------------------------------------------

// grupe vracam 3 i na 2 chars aktivira search
// tags neka vrati 3 i aktivira search na 2

export const getContent = async (
  req: TypedRequestQuery<typeof allContentQuerySchema>,
  res: Response
) => {
  const type = (req.query.type as string)?.toUpperCase() as EContentType;
  const page = req.query.page ? Number(req.query.page) : 1;
  const itemsPerPage = 4;

  let include: { [key: string]: any } = {
    tags: true,
  };

  if (type === EContentType.POST || type === EContentType.PODCAST) {
    include = {
      ...include,
      author: {
        select: {
          avatarImg: true,
          userName: true,
        },
      },
    };
  }

  try {
    const content = await prisma.content.findMany({
      where: {
        type,
      },
      include: {
        ...include,
      },
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
    });

    let modifiedContent = [];

    if (type === EContentType.POST) {
      modifiedContent = content.map(
        ({
          id,
          title,
          description,
          coverImage,
          tags,
          viewsCount,
          likesCount,
          commentsCount,
          author,
          createdAt,
        }) => ({
          id,
          title,
          description,
          coverImage,
          tags,
          viewsCount,
          likesCount,
          commentsCount,
          author,
          createdAt,
        })
      );
    } else if (type === EContentType.MEETUP) {
      modifiedContent = content.map(
        ({
          id,
          title,
          description,
          coverImage,
          tags,
          meetupLocation,
          meetupDate,
        }) => ({
          id,
          title,
          description,
          coverImage,
          tags,
          meetupLocation,
          meetupDate,
        })
      );
    } else {
      modifiedContent = content.map(
        ({
          id,
          title,
          description,
          coverImage,
          tags,
          //  author,
          createdAt,
        }) => ({
          id,
          title,
          description,
          coverImage,
          tags,
          // author,
          createdAt,
        })
      );
    }

    res.status(200).json({ content: modifiedContent });
  } catch (error) {
    console.log('Error fetching content');
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany();

    res.status(200).json({ tags });
  } catch (error) {
    console.log('Error fething tags', error);
    res
      .status(500)
      .json({ message: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' });
  }
};

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
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: {
              title: tag,
            },
            create: {
              title: tag,
            },
          })),
        },
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
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: {
              title: tag,
            },
            create: {
              title: tag,
            },
          })),
        },
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
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: {
              title: tag,
            },
            create: {
              title: tag,
            },
          })),
        },
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
        tags: {
          connectOrCreate: tags?.map((tag) => ({
            where: {
              title: tag,
            },
            create: {
              title: tag,
            },
          })),
        },
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

  try {
    const meetup = await prisma.content.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        coverImage,
        tags: {
          connectOrCreate: tags?.map((tag) => ({
            where: {
              title: tag,
            },
            create: {
              title: tag,
            },
          })),
        },
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
        tags: {
          connectOrCreate: tags?.map((tag) => ({
            where: {
              title: tag,
            },
            create: {
              title: tag,
            },
          })),
        },
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

// export const getPosts = async (req: Request, res: Response) => {
//   try {
//     const content = await prisma.content.findMany({
//       where: {
//         type: EContentType.POST,
//       },
//     });

//     let modifiedContent = content.map(
//       ({
//         id,
//         title,
//         description,
//         coverImage,
//         tags,
//         viewsCount,
//         likesCount,
//         commentsCount,
//       }) => ({
//         id,
//         title,
//         description,
//         coverImage,
//         tags,
//         viewsCount,
//         likesCount,
//         commentsCount,
//       })
//     );

//     console.log('modifiedContent', modifiedContent);

//     res.status(200).json({ content: modifiedContent });
//   } catch (error) {
//     console.log('Error fetching posts');
//     res.status(500).json({ message: 'Internal server error!' });
//   }
// };

// export const getMeetups = async (req: Request, res: Response) => {
//   try {
//     const content = await prisma.content.findMany({
//       where: {
//         type: EContentType.MEETUP,
//       },
//     });

//     const modifiedContent = content.map(
//       ({
//         id,
//         title,
//         description,
//         coverImage,
//         tags,
//         meetupLocation,
//         meetupDate,
//       }) => ({
//         id,
//         title,
//         description,
//         coverImage,
//         tags,
//         meetupLocation,
//         meetupDate,
//       })
//     );
//     res.status(200).json({ content: modifiedContent });
//   } catch (error) {
//     console.log('Error fetching meetups', error);
//     res.status(500).json({ message: 'Internal server error!' });
//   }
// };

// export const getPodcasts = async (req: Request, res: Response) => {
//   try {
//     const content = await prisma.content.findMany({
//       where: {
//         type: EContentType.PODCAST,
//       },
//     });

//     const modifiedContent = content.map(
//       ({ id, title, description, coverImage, tags }) => ({
//         id,
//         title,
//         description,
//         coverImage,
//         tags,
//       })
//     );

//     res.status(200).json({ content: modifiedContent });
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error!' });
//   }
// };
