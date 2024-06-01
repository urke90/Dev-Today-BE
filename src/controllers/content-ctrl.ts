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
  TypedRequestParams,
  TypedRequestQuery,
} from 'zod-express-middleware';

import { prisma, Prisma } from '@/database/prisma-client';
import { EContentType } from '@prisma/client';

// ----------------------------------------------------------------

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

export const getContentTags = async (
  req: TypedRequestParams<typeof idSchema>,
  res: Response
) => {
  const id = req.params.id;

  try {
    const contentsTags = await prisma.content.findMany({
      where: {
        authorId: id,
      },
      select: {
        tags: true,
      },
    });

    const tags = contentsTags.map((tag) => tag.tags).flat();

    res.status(200).json({ tags });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const getTags = async (req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany({
      where: {
        title: {
          contains: 'tech Stack',
          mode: 'insensitive',
        },
      },
    });
    console.log('tags');
    res.status(200).json({ tags });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error!' });
  }
};

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

/***************************************************************** CREATE ********************************************************** */

/**
 * 1.Imam listu tagova koje treba da dodam ['web development', 'tech stack', 'nesto']
 * 2.tagovi u mojoj bazi
 */

// const existingTagsDUMMY = [
//   { id: 'f895b8eb-ca5c-416c-8966-3b5a6b8dcb6f', title: 'Tech Stack' },
//   {
//     id: 'cbe1849f-19dc-40f2-be6d-8399878f228b',
//     title: 'Web Development',
//   },
//   { id: '6243579b-bb5a-4549-92d4-159943fb0ca2', title: 'Tech Stack' },
//   {
//     id: 'cd14a64d-d54e-42f3-8d68-4cf52146f81b',
//     title: 'Web Development',
//   },
//   { id: '58a65718-3f35-483e-b368-03dcd3df5e24', title: 'Tech Stack' },
//   {
//     id: '13ccfeb2-a771-4920-a73e-c78d2927b07e',
//     title: 'Web Development',
//   },
//   { id: 'f3a8d2a6-1d41-4130-9509-e50dcf3cba92', title: 'Tech Stack' },
//   {
//     id: '195c4563-c4dc-442d-a295-7e1f1a52be75',
//     title: 'Web Development',
//   },
//   { id: '8c860fc0-19d2-4f42-a7ea-b59f83c89eb7', title: 'Tech Stack' },
//   {
//     id: '45af3ef4-3a9f-49a2-9813-a8e1b50c248a',
//     title: 'Web Development',
//   },
//   { id: 'd4b45047-bd87-4635-a48a-99afe76aff2b', title: 'Tech Stack' },
//   {
//     id: '603d35c2-a3e7-4212-9905-c9befe1a3179',
//     title: 'Web Development',
//   },
// ];

export const createPost = async (
  req: TypedRequestBody<typeof createPostSchema>,
  res: Response
) => {
  const { description, groupId, title, type, coverImage, tags, authorId } =
    req.body;

  try {
    const existingTags = await prisma.tag.findMany({
      where: {
        title: {
          in: tags,
          mode: 'insensitive',
        },
      },
    });
    const allTags = [...existingTags];

    const existingTagsTitles = existingTags.map((tag) => tag.title);
    const tagTitlesToCreate = tags.filter(
      (tag) => !existingTagsTitles.includes(tag)
    );

    if (tagTitlesToCreate.length > 0) {
      const createdTags = await prisma.tag.createManyAndReturn({
        data: tagTitlesToCreate.map((title) => ({ title })),
        skipDuplicates: true,
      });
      allTags.concat(createdTags);
    }

    const post = await prisma.content.create({
      data: {
        title,
        type,
        description,
        coverImage,
        authorId,
        groupId,
        tags: {
          connect: allTags,
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
    const existingTags = await prisma.tag.findMany({
      where: {
        title: {
          in: tags,
          mode: 'insensitive',
        },
      },
    });
    const allTags = [...existingTags];

    const existingTagsTitles = existingTags.map((tag) => tag.title);
    const tagTitlesToCreate = tags.filter(
      (tag) => !existingTagsTitles.includes(tag)
    );

    if (tagTitlesToCreate.length > 0) {
      const createdTags = await prisma.tag.createManyAndReturn({
        data: tagTitlesToCreate.map((title) => ({ title })),
        skipDuplicates: true,
      });
      allTags.concat(createdTags);
    }

    const meetup = await prisma.content.create({
      data: {
        title,
        type,
        description,
        coverImage,
        authorId,
        groupId,
        tags: {
          connect: allTags,
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
    const existingTags = await prisma.tag.findMany({
      where: {
        title: {
          in: tags,
          mode: 'insensitive',
        },
      },
    });
    const allTags = [...existingTags];

    const existingTagsTitles = existingTags.map((tag) => tag.title);
    const tagTitlesToCreate = tags.filter(
      (tag) => !existingTagsTitles.includes(tag)
    );

    if (tagTitlesToCreate.length > 0) {
      const createdTags = await prisma.tag.createManyAndReturn({
        data: tagTitlesToCreate.map((title) => ({ title })),
        skipDuplicates: true,
      });
      allTags.concat(createdTags);
    }

    const podcast = await prisma.content.create({
      data: {
        title,
        type,
        description,
        coverImage,
        authorId,
        groupId,
        tags: {
          connect: allTags,
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
    const existingTags = await prisma.tag.findMany({
      where: {
        title: {
          in: tags,
          mode: 'insensitive',
        },
      },
    });
    const allTags = [...existingTags];

    const existingTagsTitles = existingTags.map((tag) => tag.title);
    const tagTitlesToCreate = tags?.filter(
      (tag) => !existingTagsTitles.includes(tag)
    );

    if (tagTitlesToCreate && tagTitlesToCreate.length > 0) {
      const createdTags = await prisma.tag.createManyAndReturn({
        data: tagTitlesToCreate.map((title) => ({ title })),
        skipDuplicates: true,
      });
      allTags.concat(createdTags);
    }

    const post = await prisma.content.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        coverImage,
        tags: {
          connect: allTags,
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

  console.log('meetup date', meetupDate);

  try {
    const existingTags = await prisma.tag.findMany({
      where: {
        title: {
          in: tags,
          mode: 'insensitive',
        },
      },
    });
    const allTags = [...existingTags];

    const existingTagsTitles = existingTags.map((tag) => tag.title);
    const tagTitlesToCreate = tags?.filter(
      (tag) => !existingTagsTitles.includes(tag)
    );

    if (tagTitlesToCreate && tagTitlesToCreate.length > 0) {
      const createdTags = await prisma.tag.createManyAndReturn({
        data: tagTitlesToCreate.map((title) => ({ title })),
        skipDuplicates: true,
      });
      allTags.concat(createdTags);
    }

    const meetup = await prisma.content.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        coverImage,
        tags: {
          connect: allTags,
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
    const existingTags = await prisma.tag.findMany({
      where: {
        title: {
          in: tags,
          mode: 'insensitive',
        },
      },
    });
    const allTags = [...existingTags];

    const existingTagsTitles = existingTags.map((tag) => tag.title);
    const tagTitlesToCreate = tags?.filter(
      (tag) => !existingTagsTitles.includes(tag)
    );

    if (tagTitlesToCreate && tagTitlesToCreate.length > 0) {
      const createdTags = await prisma.tag.createManyAndReturn({
        data: tagTitlesToCreate.map((title) => ({ title })),
        skipDuplicates: true,
      });
      allTags.concat(createdTags);
    }

    const podcast = await prisma.content.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        coverImage,
        tags: {
          connect: allTags,
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
