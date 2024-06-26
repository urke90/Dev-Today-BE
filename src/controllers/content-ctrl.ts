import { idSchema, viewerIdSchema } from '@/lib/zod/common';
import {
  allContentQuerySchema,
  commentsSchema,
  likeCommentsSchema,
  meetupSchema,
  podcastSchema,
  postSchema,
  tagsTitleSchema,
  updateMeetupSchema,
  updatePostSchema,
} from '@/lib/zod/content';
import type { Response } from 'express';
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
  const limit = req.query.limit ? Number(req.query.limit) : 4;

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
    const fetchedContent = await prisma.content.findMany({
      where: {
        type,
      },
      include: {
        ...include,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    let content = [];

    if (type === EContentType.POST) {
      content = fetchedContent.map(
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
      content = fetchedContent.map(
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
      content = fetchedContent.map(
        ({ id, title, description, coverImage, tags, author, createdAt }) => ({
          id,
          title,
          description,
          coverImage,
          tags,
          author,
          createdAt,
        })
      );
    }

    res.status(200).json(content);
  } catch (error) {
    console.log('Error fetching content');
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const getContentById = async (
  req: TypedRequestParams<typeof idSchema>,
  res: Response
) => {
  const id = req.params.id;

  try {
    const content = await prisma.content.findUnique({
      where: {
        id,
      },
      include: {
        tags: true,
        group: {
          select: {
            coverImage: true,
            name: true,
            bio: true,
            id: true,
          },
        },
      },
    });

    res.status(200).json(content);
  } catch (error) {
    console.log('Error fething tags', error);
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const getAllTags = async (
  req: TypedRequestQuery<typeof tagsTitleSchema>,
  res: Response
) => {
  const title = req.query.title;
  const limit = req.query.limit ? Number(req.query.limit) : 4;

  let where: { [ket: string]: any } = {};

  if (title?.trim() !== '') {
    where = {
      title: {
        contains: title,
        mode: 'insensitive',
      },
    };
  }

  try {
    const tags = await prisma.tag.findMany({
      where,
      take: limit,
    });

    res.status(200).json(tags);
  } catch (error) {
    console.log('Error fething tags', error);
    res.status(500).json({ message: 'Internal server error!' });
  }
};

/***************************************************************** CREATE ********************************************************** */

export const createPost = async (
  req: TypedRequestBody<typeof postSchema>,
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

    res.status(201).json(post);
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
  req: TypedRequestBody<typeof meetupSchema>,
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

    res.status(201).json(meetup);
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
  req: TypedRequestBody<typeof podcastSchema>,
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

    res.status(201).json(podcast);
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
  req: TypedRequest<
    typeof idSchema,
    typeof viewerIdSchema,
    typeof updatePostSchema
  >,
  res: Response
) => {
  const postId = req.params.id;
  const viewerId = req.query.viewerId;
  const { description, title, coverImage, tags } = req.body;

  try {
    const existingPost = await prisma.content.findUnique({
      where: {
        id: postId,
      },
      include: {
        tags: true,
      },
    });

    if (!existingPost)
      return res.status(404).json({ message: 'Post not found!' });

    if (existingPost.authorId !== viewerId)
      return res.status(401).json({ message: 'Unauthorized' });

    const tagsToRemove = existingPost.tags.filter(
      (t) => !tags.includes(t.title)
    );

    const post = await prisma.content.update({
      where: {
        id: postId,
      },
      data: {
        title,
        description,
        coverImage,
        tags: {
          disconnect: tagsToRemove.map((tag) => ({ title: tag.title })),
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

    res.status(201).json(post);
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
  req: TypedRequest<
    typeof idSchema,
    typeof viewerIdSchema,
    typeof updateMeetupSchema
  >,
  res: Response
) => {
  const meetupId = req.params.id;
  const viewerId = req.query.viewerId;

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
    const existingMeetup = await prisma.content.findUnique({
      where: {
        id: meetupId,
      },
      include: {
        tags: true,
      },
    });

    if (!existingMeetup)
      return res.status(404).json({ message: 'Post not found!' });

    if (existingMeetup.authorId !== viewerId)
      return res.status(401).json({ message: 'Unauthorized' });

    const tagsToRemove = existingMeetup.tags.filter(
      (t) => !tags.includes(t.title)
    );

    const meetup = await prisma.content.update({
      where: {
        id: meetupId,
      },
      data: {
        title,
        description,
        coverImage,
        tags: {
          disconnect: tagsToRemove.map((tag) => ({ title: tag.title })),
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

    res.status(201).json(meetup);
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
  req: TypedRequest<
    typeof idSchema,
    typeof viewerIdSchema,
    typeof podcastSchema
  >,
  res: Response
) => {
  const podcastId = req.params.id;
  const viewerId = req.query.viewerId;
  const { description, title, coverImage, tags, podcastFile, podcastTitle } =
    req.body;

  try {
    const existingPodcast = await prisma.content.findUnique({
      where: {
        id: podcastId,
      },
      include: {
        tags: true,
      },
    });

    if (!existingPodcast)
      return res.status(404).json({ message: 'Post not found!' });

    if (existingPodcast.authorId !== viewerId)
      return res.status(401).json({ message: 'Unauthorized' });

    const tagsToRemove = existingPodcast.tags.filter(
      (t) => !tags.includes(t.title)
    );

    const podcast = await prisma.content.update({
      where: {
        id: podcastId,
      },
      data: {
        title,
        description,
        coverImage,
        tags: {
          disconnect: tagsToRemove.map((tag) => ({ title: tag.title })),
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

    res.status(201).json(podcast);
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

/***************************************************************** COMMENTS ***********************************************************/

export const getAllComments = async (
  req: TypedRequestParams<typeof idSchema>,
  res: Response
) => {
  const contentId = req.params.id;
  try {
    const comments = await prisma.comment.findMany({
      where: {
        contentId,
      },
      include: {
        author: {
          select: {
            userName: true,
            avatarImg: true,
          },
        },
        replyingTo: {
          select: {
            text: true,
            createdAt: true,
            updatedAt: true,
            author: {
              select: {
                userName: true,
                avatarImg: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const clearComments = comments.map((comment) => {
      const { replyingToId, ...rest } = comment;
      return rest;
    });

    res.status(200).json(clearComments);
  } catch (error) {
    console.log('Error fetching comments', error);
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const createComment = async (
  req: TypedRequestBody<typeof commentsSchema>,
  res: Response
) => {
  const { replyingToId, text, authorId, contentId } = req.body;

  try {
    await prisma.comment.create({
      data: {
        text,
        author: {
          connect: {
            id: authorId,
          },
        },
        replyingTo: replyingToId
          ? {
              connect: {
                id: replyingToId,
              },
            }
          : undefined,
        content: {
          connect: {
            id: contentId,
          },
        },
      },
    });
    res.status(201).json({ message: 'Comment created successfully!' });
  } catch (error) {
    console.log('Error creating comment', error);
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const deleteComment = async (
  req: TypedRequestBody<typeof idSchema>,
  res: Response
) => {
  const commentId = req.body.id;

  try {
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    res.status(200).json({ message: 'Comment deleted successfully!' });
  } catch (error) {
    console.log('Error deleting comment', error);
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const updateComment = async (
  req: TypedRequestBody<typeof commentsSchema>,
  res: Response
) => {
  const { id, replyingToId, text, authorId, contentId } = req.body;

  try {
    if (replyingToId) {
      await prisma.comment.update({
        where: {
          id: replyingToId,
        },
        data: {
          text,
          author: {
            connect: {
              id: authorId,
            },
          },
          content: {
            connect: {
              id: contentId,
            },
          },
        },
      });
    } else {
      await prisma.comment.update({
        where: {
          id: id,
        },
        data: {
          text,
          author: {
            connect: {
              id: authorId,
            },
          },
          content: {
            connect: {
              id: contentId,
            },
          },
        },
      });
    }
    res.status(201).json({ message: 'Comment updated successfully!' });
  } catch (error) {
    console.log('Error updating comment', error);
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const createUpdateCommentLike = async (
  req: TypedRequestBody<typeof likeCommentsSchema>,
  res: Response
) => {
  const { id: commentId, userId } = req.body;

  try {
    await prisma.$transaction(async (prisma) => {
      const existingLike = await prisma.comment.findFirst({
        where: {
          id: commentId,
          likes: {
            some: {
              id: userId,
            },
          },
        },
      });

      if (existingLike) {
        await prisma.comment.update({
          where: {
            id: commentId,
          },
          data: {
            likes: {
              disconnect: {
                id: userId,
              },
            },
          },
        });
      } else {
        await prisma.comment.update({
          where: {
            id: commentId,
          },
          data: {
            likes: {
              connect: {
                id: userId,
              },
            },
          },
        });
      }
    });

    res.status(200).json({ message: 'Like updated successfully!' });
  } catch (error) {
    console.log('Error updating like', error);
    res.status(500).json({ message: 'Internal server error!' });
  }
};
/***************************************************************** UPDATE ***********************************************************/

// ! getContent replaced this code ===> Left this just in case we need it later ( )
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
