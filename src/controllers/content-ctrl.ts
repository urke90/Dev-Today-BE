import { idSchema, viewerIdSchema } from '@/lib/zod/common';
import {
  allContentQuerySchema,
  commentsSchema,
  contentIdSchema,
  getAllContentSidebarDetailsSchema,
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
  const itemsPerPage = req.query.limit ? Number(req.query.limit) : 4;
  const viewerId = req.query.viewerId;
  const sortBy = req.query.sortBy;

  let include: { [key: string]: any } = {};
  let orderBy: { [key: string]: any } = {};
  let where: { [key: string]: any } = {};

  try {
    if (sortBy === 'recent') {
      orderBy = {
        createdAt: 'desc',
      };
    } else if (sortBy === 'popular') {
      orderBy = {
        likesCount: 'desc',
      };
    } else if (sortBy === 'following') {
      where = {
        ...where,
        author: {
          followers: {
            some: {
              followerId: viewerId,
            },
          },
        },
      };
      orderBy = {
        createdAt: 'desc',
      };
    }

    if (type) {
      where = {
        ...where,
        type,
      };
    }

    const fetchedContent = await prisma.content.findMany({
      where,
      orderBy,
      include: {
        tags: true,
        ...include,
        author: {
          select: {
            avatarImg: true,
            userName: true,
          },
        },
      },
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
    });

    const contents = fetchedContent.map((content) => {
      if (content.type === EContentType.POST) {
        return {
          id: content.id,
          title: content.title,
          description: content.description,
          coverImage: content.coverImage,
          tags: content.tags,
          viewsCount: content.viewsCount,
          likesCount: content.likesCount,
          commentsCount: content.commentsCount,
          author: content.author,
          createdAt: content.createdAt,
        };
      } else if (content.type === EContentType.MEETUP) {
        return {
          id: content.id,
          title: content.title,
          description: content.description,
          coverImage: content.coverImage,
          tags: content.tags,
          meetupLocation: content.meetupLocation,
          meetupDate: content.meetupDate,
        };
      } else if (content.type === EContentType.PODCAST) {
        return {
          id: content.id,
          title: content.title,
          description: content.description,
          coverImage: content.coverImage,
          tags: content.tags,
          author: content.author,
          createdAt: content.createdAt,
        };
      }
    });

    const contentCount = await prisma.content.count({
      where,
    });

    const totalPages = Math.ceil(contentCount / itemsPerPage);
    const hasNextPage = page < totalPages;

    res.status(200).json({ contents, totalPages, hasNextPage });
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
  req: TypedRequest<typeof idSchema, typeof viewerIdSchema, any>,
  res: Response
) => {
  const contentId = req.params.id;
  const viewerId = req.query.viewerId;
  try {
    const comments = await prisma.comment.findMany({
      where: { contentId, replyingTo: null },
      select: {
        id: true,
        text: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        contentId: true,
        likes: {
          select: {
            id: true,
          },
        },
        author: {
          select: {
            userName: true,
            avatarImg: true,
          },
        },
        replies: {
          select: {
            text: true,
            createdAt: true,
            author: {
              select: {
                userName: true,
                avatarImg: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const commentsWithViewerLikeStatus = comments.map((comment) => {
      const viewerHasLiked = comment.likes.some((like) => like.id === viewerId);
      return {
        ...comment,
        viewerHasLiked,
      };
    });

    res.status(200).json(commentsWithViewerLikeStatus);
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
    const result = await prisma.$transaction(async (prisma) => {
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
        return true;
      }
    });

    res
      .status(200)
      .json({ message: 'Like updated successfully!', liked: result });
  } catch (error) {
    console.log('Error updating like', error);
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const getContentStatsSidebar = async (
  req: TypedRequestQuery<typeof getAllContentSidebarDetailsSchema>,
  res: Response
) => {
  let { posts, meetups, podcasts, viewerId } = req.query;
  let postsData, meetupsData, podcastsData;

  try {
    if (posts === 'true') {
      postsData = await prisma.content.findMany({
        where: {
          type: EContentType.POST,
        },
        select: {
          id: true,
          title: true,
          type: true,
          coverImage: true,
          author: {
            select: {
              userName: true,
            },
          },
        },
        take: 5,
        orderBy: {
          likes: {
            _count: 'desc',
          },
        },
      });
    }

    if (meetups === 'true') {
      meetupsData = await prisma.content.findMany({
        where: {
          type: EContentType.MEETUP,
        },
        select: {
          id: true,
          title: true,
          type: true,
          coverImage: true,
          tags: true,
          meetupLocation: true,
          meetupDate: true,
        },
        orderBy: {
          meetupDate: 'desc',
        },
        take: 5,
      });
    }

    if (podcasts === 'true') {
      podcastsData = await prisma.content.findMany({
        where: {
          type: EContentType.PODCAST,
        },
        select: {
          id: true,
          title: true,
          type: true,
          coverImage: true,
          author: {
            select: {
              userName: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      });
    }

    const popularTags = await prisma.tag.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            contents: true,
          },
        },
      },
      orderBy: {
        contents: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    const popularTagsSorted = popularTags.map((tag) => ({
      id: tag.id,
      title: tag.title,
      count: tag._count.contents,
    }));

    const popularGroups = await prisma.group.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            contents: true,
          },
        },
      },
      orderBy: {
        contents: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    const followingUsersCount = await prisma.user.count({
      where: {
        followers: {
          some: {
            followerId: viewerId,
          },
        },
      },
    });

    const popularGroupsSorted = popularGroups.map((group) => ({
      id: group.id,
      name: group.name,
      count: group._count.contents,
    }));

    res.status(200).json({
      popularTagsSorted,
      popularGroupsSorted,
      posts: postsData,
      meetups: meetupsData,
      podcasts: podcastsData,
      followingUsersCount,
    });
  } catch (error) {
    console.log('Error fetching content stats', error);
    res.status(500).json({ message: 'Internal server error!' });
  }
};

/***************************************************************** UPDATE ***********************************************************/

export const createLike = async (
  req: TypedRequest<typeof idSchema, any, typeof contentIdSchema>,
  res: Response
) => {
  const id = req.params.id;
  const { contentId } = req.body;
  try {
    const existingLike = await prisma.like.findUnique({
      where: { userId_contentId: { userId: id, contentId } },
    });
    if (existingLike)
      return res.status(409).json({ message: 'Existing like.' });

    await prisma.$transaction([
      prisma.like.create({
        data: {
          userId: id!,
          contentId,
        },
      }),
      prisma.content.update({
        where: { id: contentId },
        data: {
          likesCount: {
            increment: 1,
          },
        },
      }),
    ]);
    res.json({ message: 'Liked.' });
  } catch (error) {
    res.status(500).json({
      message: 'Oops! An internal server error occurred on our end.',
    });
  }
};

export const removeLike = async (
  req: TypedRequest<typeof idSchema, any, typeof contentIdSchema>,
  res: Response
) => {
  const id = req.params.id;
  const { contentId } = req.body;

  try {
    const existingLike = await prisma.like.findUnique({
      where: { userId_contentId: { userId: id, contentId } },
    });
    if (!existingLike)
      return res.status(404).json({ message: 'Liked content is not found.' });

    await prisma.$transaction([
      prisma.like.delete({
        where: { userId_contentId: { userId: id, contentId } },
      }),
      prisma.content.update({
        where: { id: contentId },
        data: {
          likesCount: {
            decrement: 1,
          },
        },
      }),
    ]);
    res.json({ message: 'Like removed.' });
  } catch (error) {
    res.status(500).json({
      message: 'Oops! An internal server error occurred on our end.',
    });
  }
};
