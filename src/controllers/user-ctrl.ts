import { Prisma, prisma } from '@/database/prisma-client';
import {
  createLikeSchema,
  getAllUsersSchema,
  getUserContentTypeSchema,
  getUserGroupSchema,
  loginProviderSchema,
  loginSchema,
  onboardingSchema,
  paramsEmailSchema,
  paramsIdSchema,
  profileSchema,
  registerSchema,
  userIdSchema,
} from '@/lib/zod/user';
import {
  IGroupContent,
  IGroupMember,
  IGroupWithMembersAndCount,
} from '@/types/group';
import { excludeField, excludeProperty } from '@/utils/prisma-functions';
import { EContentType } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { compare, genSalt, hash } from 'bcrypt';
import type { Response } from 'express';
import {
  TypedRequest,
  TypedRequestQuery,
  type TypedRequestBody,
  type TypedRequestParams,
} from 'zod-express-middleware';

// ----------------------------------------------------------------

export const getUserByEmail = async (
  req: TypedRequestParams<typeof paramsEmailSchema>,
  res: Response
) => {
  const email = req.params.email;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: excludeField('User', ['password']),
    });

    if (!user) return res.status(404).send('User not found!');

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({
      message: 'Oops! An internal server error occurred on our end.',
    });
    console.log('Error fetching user with email', error);
  }
};

export const getAllUsers = async (
  req: TypedRequestQuery<typeof getAllUsersSchema>,
  res: Response
) => {
  const limit = req.query.limit ? Number(req.query.limit) : 4;
  const q = req.query.q || '';

  let where: { [key: string]: any } = {};

  if (q.trim() !== '') {
    where = {
      OR: [
        {
          userName: {
            contains: q,
            mode: 'insensitive',
          },
        },
        {
          name: {
            contains: q,
            mode: 'insensitive',
          },
        },
      ],
    };
  }

  try {
    const fetchedUsers = await prisma.user.findMany({
      where,
      take: limit,
    });

    const users = fetchedUsers.map(({ avatarImg, userName, id }) => ({
      id,
      userName,
      avatarImg,
    }));

    res.status(200).json(users);
  } catch (error) {
    console.log('Error fetching user with email', error);
    res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

export const registerUser = async (
  req: TypedRequestBody<typeof registerSchema>,
  res: Response
) => {
  const { userName, email, password } = req.body;

  try {
    const saltRounds = 10;

    const salt = await genSalt(saltRounds);
    const hashPw = await hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        userName,
        email,
        password: hashPw,
      },
    });

    const user = excludeProperty(newUser, ['password']);

    res.status(201).json({ user });
  } catch (error) {
    console.log('Error registering user!', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res
          .status(409)
          .json({ message: 'User with provided email already exists!' });
      }
    }
    res.status(500).json({
      message: 'Oops! An internal server error occurred on our end.',
    });
  }
};

export const loginUser = async (
  req: TypedRequestBody<typeof loginSchema>,
  res: Response
) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser)
      return res
        .status(404)
        .json({ message: 'User with provided email not found!' });

    if (!existingUser.password) throw new Error('User has no password!');

    if (!(await compare(password, existingUser.password)))
      return res
        .status(400)
        .json({ message: 'You have entered wrong password!' });

    const user = excludeProperty(existingUser, ['password']);

    res.status(200).json({ user });
  } catch (error) {
    console.log('Error logging in user', error);
    res.status(500).json({
      message: 'Oops! An internal server error occurred on our end.',
    });
  }
};

export const deleteUser = async (
  req: TypedRequestParams<typeof paramsIdSchema>,
  res: Response
) => {
  const id = req.params.id;

  try {
    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: 'User deleted!' });
  } catch (error) {
    console.log('Error deleting user!', error);
    res.status(500).json({
      message: 'Oops! An internal server error occurred on our end.',
    });
  }
};

export const loginUserWithProvider = async (
  req: TypedRequestBody<typeof loginProviderSchema>,
  res: Response
) => {
  const { email, name, avatarImg } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: excludeField('User', ['password']),
    });

    if (existingUser) return res.status(200).json({ user: existingUser });

    const newUser = await prisma.user.create({
      data: {
        name,
        userName: name,
        email,
        avatarImg,
      },
    });
    res.status(200).json({ user: newUser });
  } catch (error) {
    console.log('Error logging in user', error);
    res.status(500).json({
      message: 'Oops! An internal server error occurred on our end.',
    });
  }
};

export const updateUserOnboarding = async (
  // TODO: have to fix "any" since
  req: TypedRequest<typeof paramsIdSchema, any, typeof onboardingSchema>,
  res: Response
) => {
  const id = req.params.id;
  const {
    codingAmbitions,
    currentKnowledge,
    preferredSkills,
    isOnboardingCompleted,
  } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        codingAmbitions,
        currentKnowledge,
        preferredSkills,
        isOnboardingCompleted,
      },
    });

    const user = excludeProperty(updatedUser, ['password']);

    res.status(200).json({ user });
  } catch (error) {
    console.log('Error updating user onboarding!', error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res.status(404).json({ message: 'User not found!' });
      }
    }
    res.status(500).json({
      message: 'Oops! An internal server error occurred on our end.',
    });
  }
};

export const followUser = async (
  req: TypedRequest<typeof paramsIdSchema, any, typeof userIdSchema>,
  res: Response
) => {
  // id is the person we want to follow
  const { id } = req.params;
  // userId is viewerID (user loged in)
  const { userId } = req.body;

  try {
    if (userId) {
      const existingFollow = await prisma.followers.findUnique({
        where: {
          followerId_followingId: { followerId: userId, followingId: id },
        },
      });
      if (existingFollow) {
        await prisma.followers.delete({
          where: {
            followerId_followingId: { followerId: userId, followingId: id },
          },
        });
      } else {
        await prisma.followers.create({
          data: {
            followerId: userId,
            followingId: id,
          },
        });
      }
    }

    const followersCount = await prisma.followers.count({
      where: { followingId: id },
    });

    const followingCount = await prisma.followers.count({
      where: { followerId: id },
    });

    res.status(200).json({
      message: 'User followed!',
      followersCount,
      followingCount,
    });
  } catch (error) {
    console.log('Error following user', error);
    res.status(500).json({
      message: 'Oops! An internal server error occurred on our end.',
    });
  }
};

export const createLike = async (
  req: TypedRequest<typeof paramsIdSchema, any, typeof createLikeSchema>,
  res: Response
) => {
  const id = req.params.id;
  const { contentId } = req.body;
  try {
    const existingLike = await prisma.like.findUnique({
      where: { userId_contentId: { userId: id!, contentId } },
    });
    if (existingLike) {
      await prisma.$transaction([
        prisma.like.delete({
          where: { userId_contentId: { userId: id!, contentId } },
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
      res.json({ message: 'Like removed!' });
    } else {
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
      res.json({ message: 'Like has been added.' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Oops! An internal server error occurred on our end.',
    });
  }
};

export const getUserById = async (
  req: TypedRequest<typeof paramsIdSchema, typeof profileSchema, any>,
  res: Response
) => {
  // User profile viewed
  const id = req.params.id;
  const userId = req.query.userId;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        followers: {
          where: {
            followerId: userId,
          },
        },
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
        contents: {
          select: {
            id: true,
            author: {
              select: {
                userName: true,
                avatarImg: true,
              },
            },
            type: true,
            meetupDate: true,
            tags: true,
            title: true,
            description: true,
            coverImage: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 3,
        },
      },
    });

    if (!user) return res.status(404).json({ message: 'User not found!' });

    let isFollowing = false;
    user.followers.forEach((follower) => {
      if (follower.followerId === userId) {
        isFollowing = true;
      }
    });

    res.status(200).json({ user, isFollowing: user.followers.length > 0 });
  } catch (error) {
    console.log('Error fetching user by id', error);
    res
      .status(500)
      .json({ message: 'Oops! An internal server error occurred on our end.' });
  }
};

export const getUserContent = async (
  req: TypedRequest<
    typeof paramsIdSchema,
    typeof getUserContentTypeSchema,
    any
  >,
  res: Response
) => {
  const id = req.params.id;
  const { type, viewerId } = req.query;
  const page = req.query.page ? Number(req.query.page) : 1;
  const itemsPerPage = req.query.limit ? Number(req.query.limit) : 6;

  try {
    const content = await prisma.content.findMany({
      where: {
        authorId: id,
        type: type?.toUpperCase() as EContentType,
      },
      include: {
        likes: {
          where: {
            userId: viewerId,
          },
        },
      },
      skip: (page - 1) * 6,
      take: itemsPerPage,
    });

    if (!content) return res.status(404).json({ message: 'No content found!' });

    const contentWithLike = content.map((contentItem) => ({
      ...contentItem,
      isLiked: contentItem.likes.length > 0,
      likes: undefined,
    }));

    const contentCount = await prisma.content.count({
      where: {
        type: type?.toUpperCase() as EContentType,
      },
    });
    const totalPages = Math.ceil(contentCount / itemsPerPage);
    const hasNextPage = page < totalPages;

    res
      .status(200)
      .json({ contents: contentWithLike, totalPages, hasNextPage });
  } catch (error) {
    console.log('Error fetching user content', error);
    res
      .status(500)
      .json({ message: 'Oops! An internal server error occurred on our end.' });
  }
};

export const getUserGroups = async (
  req: TypedRequest<typeof paramsIdSchema, typeof getUserGroupSchema, any>,
  res: Response
) => {
  const userId = req.params.id;
  const page = req.query.page ? Number(req.query.page) : 1;
  const itemsPerPage = 6;

  try {
    // TODO fix types in the controller, remove ANY
    let groupContent: any = await prisma.groupUser.findMany({
      where: {
        userId,
      },
      include: {
        group: {
          include: {
            _count: {
              select: {
                members: true,
              },
            },
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    avatarImg: true,
                  },
                },
              },
              take: 4,
            },
          },
        },
      },
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
    });

    // TODO fix interfaces/types naming
    if (groupContent) {
      groupContent = groupContent.map(
        (groupMember: IGroupContent) => groupMember.group
      );
      groupContent = groupContent.map((group: IGroupWithMembersAndCount) => ({
        ...group,
        members: group.members.map((member: IGroupMember) => member.user),
      }));
    }

    console.log('GROUP CONTEN U CONTROLLERU', groupContent);

    const groupCount = await prisma.groupUser.count({
      where: {
        userId,
      },
    });
    const totalPages = Math.ceil(groupCount / itemsPerPage);
    const hasNextPage = page < totalPages;

    res.status(200).json({ groups: groupContent, totalPages, hasNextPage });
  } catch (error) {
    console.log('Error fetching user group content', error);
    res
      .status(500)
      .json({ message: 'Oops! An internal server error occurred on our end.' });
  }
};

export const updateUserProfile = async (
  req: TypedRequest<typeof paramsIdSchema, any, typeof profileSchema>,
  res: Response
) => {
  const id = req.params.id;
  const {
    userName,
    bio,
    preferredSkills,
    avatarImg,
    linkedinName,
    linkedinLink,
    twitterName,
    twitterLink,
    instagramName,
    instagramLink,
  } = req.body;

  try {
    await prisma.user.update({
      where: { id },
      data: {
        avatarImg: avatarImg,
        userName: userName,
        bio: bio,
        preferredSkills: preferredSkills,
        linkedinName: linkedinName,
        linkedinLink: linkedinLink,
        twitterName: twitterName,
        twitterLink: twitterLink,
        instagramName: instagramName,
        instagramLink: instagramLink,
      },
    });
    res.status(200).json({ message: 'User profile updated!' });
  } catch (error) {
    console.log('Error updating user profile', error);
    res
      .status(500)
      .json({ message: 'Oops! An internal server error occurred on our end.' });
  }
};
