import { Prisma, prisma } from '@/database/prisma-client';
import { idSchema, viewerIdSchema } from '@/lib/zod/common';

import {
  createGroupSchema,
  getAllGroupsSchema,
  getAllGroupsSidbarDetailsSchema,
  getGroupByIdSchema,
  getGroupContentSchema,
  getGroupMembersSchema,
  groupMemebersActionsSchema,
  joinOrLeaveGroupSchema,
  updateGroupSchema,
} from '@/lib/zod/group';
import { EContentType, Role } from '@prisma/client';
import type { Response } from 'express';
import type {
  TypedRequest,
  TypedRequestBody,
  TypedRequestQuery,
} from 'zod-express-middleware';

// ----------------------------------------------------------------

export const createGroup = async (
  req: TypedRequestBody<typeof createGroupSchema>,
  res: Response
) => {
  const { authorId, members, name, bio, coverImage, profileImage } = req.body;

  const newMembers =
    members?.filter((member) => member.userId !== authorId) || [];

  try {
    const newGroup = await prisma.group.create({
      data: {
        authorId,
        name,
        coverImage,
        profileImage,
        bio,
        members: {
          create: [...newMembers, { userId: authorId, role: Role.ADMIN }],
        },
      },
    });

    res.status(201).json({ group: newGroup });
  } catch (error) {
    console.log('Error creating group', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        res.status(400).json({ message: 'Invalid author ID' });
      }
    }
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const updateGroup = async (
  req: TypedRequest<typeof idSchema, any, typeof updateGroupSchema>,
  res: Response
) => {
  const id = req.params.id;
  const { bio, coverImage, name, profileImage } = req.body;

  try {
    const updatedGroup = await prisma.group.update({
      where: {
        id,
      },
      data: {
        name,
        profileImage,
        coverImage,
        bio,
      },
    });

    res.status(200).json({ group: updatedGroup });
  } catch (error) {
    console.log('Error updating group', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        res.status(400).json({ message: 'Invalid author ID' });
      }
    }
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const getAllGroups = async (
  req: TypedRequestQuery<typeof getAllGroupsSchema>,
  res: Response
) => {
  const groupsPerPage = req.query.limit ? Number(req.query.limit) : 4;
  const page = req.query.page ? Number(req.query.page) : 1;
  const q = req.query.q;
  const members = req.query.members;
  const sortBy = req.query.sortBy;
  const viewerId = req.query.viewerId;

  let where: { [key: string]: any } = {};
  let include: { [key: string]: any } = {};
  let orderBy: { [key: string]: any } = {};

  try {
    if (q) {
      where = { ...where, name: { contains: q, mode: 'insensitive' } };
    }

    if (members === 'true') {
      include = {
        members: {
          select: {
            user: {
              select: {
                avatarImg: true,
              },
            },
          },
          take: 4,
        },
        _count: {
          select: {
            members: true,
          },
        },
      };
    }

    if (sortBy === 'recent') {
      orderBy = {
        createdAt: 'desc',
      };
    } else if (sortBy === 'popular') {
      orderBy = {
        members: {
          _count: 'desc',
        },
      };
    } else if (sortBy === 'joined') {
      where = {
        ...where,
        members: {
          some: { userId: viewerId },
        },
      };
    }

    const totalGroups = await prisma.group.count({
      where,
    });
    const totalPages = Math.ceil(totalGroups / groupsPerPage);
    const hasNextPage = page < totalPages;

    const groups = await prisma.group.findMany({
      where,
      orderBy,
      include,
      take: groupsPerPage,
      skip: (page - 1) * groupsPerPage,
    });

    res.status(200).json({ groups, totalPages, hasNextPage });
  } catch (error) {
    console.log('Error getting groups', error);

    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const getAllGroupsSidbarDetails = async (
  req: TypedRequestQuery<typeof getAllGroupsSidbarDetailsSchema>,
  res: Response
) => {
  try {
    const topRankedGroups = await prisma.group.findMany({
      orderBy: {
        contents: {
          _count: 'desc',
        },
      },
      select: {
        id: true,
        name: true,
        coverImage: true,
        _count: {
          select: {
            contents: true,
          },
        },
      },
      take: 5,
    });

    const topActiveGroups = await prisma.group.findMany({
      orderBy: {
        members: {
          _count: 'desc',
        },
      },
      select: {
        id: true,
        name: true,
        coverImage: true,
        _count: {
          select: {
            members: true,
          },
        },
      },
      take: 5,
    });

    const meetups = await prisma.content.findMany({
      where: {
        type: EContentType.MEETUP,
      },
      orderBy: {
        meetupDate: 'desc',
      },
      select: {
        id: true,
        type: true,
        meetupDate: true,
        title: true,
        meetupLocation: true,
        tags: true,
      },
      take: 3,
    });

    const podcasts = await prisma.content.findMany({
      where: {
        type: EContentType.PODCAST,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        type: true,
        coverImage: true,
        title: true,
        author: {
          select: {
            userName: true,
          },
        },
      },
      take: 3,
    });

    const posts = await prisma.content.findMany({
      where: {
        type: EContentType.POST,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        type: true,
        title: true,
        coverImage: true,
        author: {
          select: {
            userName: true,
          },
        },
      },
      take: 2,
    });

    res
      .status(200)
      .json({ topRankedGroups, topActiveGroups, meetups, podcasts, posts });
  } catch (error) {
    console.log('Error getting groups', error);

    res.status(500).json({ message: 'Internal server error!' });
  }
};

type IGetGroupById = Prisma.GroupGetPayload<{
  include: {
    _count: {
      select: {
        contents: true;
        members: true;
      };
    };
    contents: {
      where: {
        type: 'MEETUP';
      };
      orderBy: {
        meetupDate: 'desc';
      };
      select: {
        id: true;
        type: true;
        meetupDate: true;
        title: true;
        meetupLocation: true;
        tags: true;
      };
      take: 3;
    };
    members: {
      select: {
        role: true;
        user: {
          select: {
            id: true;
            avatarImg: true;
            userName: true;
          };
        };
      };
      take: 15;
    };
    author: {
      select: {
        userName: true;
      };
    };
  };
}>;

export const getGroupById = async (
  req: TypedRequest<typeof idSchema, typeof getGroupByIdSchema, any>,
  res: Response
) => {
  const id = req.params.id;
  const members = req.query.members;
  const stats = req.query.stats;
  const meetups = req.query.meetups;
  const topRankedGroups = req.query.topRankedGroups;
  const viewerId = req.query.viewerId;

  let include: { [key: string]: any } = {};
  let fetchedTopRankedGroups;

  try {
    if (stats === 'true') {
      include = {
        ...include,
        _count: {
          select: {
            contents: true,
            members: true,
          },
        },
      };
    }

    // TODO: Should i transform this data to get "role" prop inside "user" object????
    if (members === 'true') {
      include = {
        ...include,
        members: {
          select: {
            role: true,
            user: {
              select: {
                id: true,
                avatarImg: true,
                userName: true,
              },
            },
          },
          take: 15,
        },
      };
    }

    if (meetups === 'true') {
      include = {
        ...include,
        contents: {
          where: {
            type: EContentType.MEETUP,
          },
          orderBy: {
            meetupDate: 'desc',
          },
          select: {
            id: true,
            type: true,
            meetupDate: true,
            title: true,
            meetupLocation: true,
            tags: true,
          },
          take: 3,
        },
      };
    }

    const group = (await prisma.group.findUnique({
      where: {
        id,
      },
      include: {
        ...include,
        author: {
          select: {
            userName: true,
          },
        },
      },
    })) as IGetGroupById;

    if (topRankedGroups === 'true') {
      fetchedTopRankedGroups = await prisma.group.findMany({
        orderBy: {
          contents: {
            _count: 'desc',
          },
        },
        select: {
          id: true,
          name: true,
          profileImage: true,
          _count: {
            select: {
              contents: true,
            },
          },
        },
        take: 5,
      });
    }

    let transformedMembers;

    if (group && 'members' in group) {
      transformedMembers = group.members.map((member) => ({
        role: member.role,
        ...member.user,
      }));
    }

    const isGroupOwner = group.authorId === viewerId;
    const isGroupAdmin = group.members?.some(
      (member) => member.user.id === viewerId && member.role === Role.ADMIN
    );
    const isGroupUser = group.members?.some(
      (member) => member.user.id === viewerId && member.role === Role.USER
    );

    res.status(200).json({
      group: {
        ...group,
        members: transformedMembers,
      },
      isGroupOwner,
      isGroupAdmin,
      isGroupUser,
      topRankedGroups: fetchedTopRankedGroups,
    });
  } catch (error) {
    console.log('Error getting group', error);

    res.status(500).json({ message: 'Internal server error!' });
  }
};

// type IGetGroupMemebers = Prisma.GroupUserGetPayload<{
//   select: {
//     role: true;
//     user: {
//       select: {
//         id: true;
//         avatarImg: true;
//         userName: true;
//       };
//     };
//   };
// }>;

export const getGroupContent = async (
  req: TypedRequest<typeof idSchema, typeof getGroupContentSchema, any>,
  res: Response
) => {
  const groupId = req.params.id;
  const viewerId = req.query.viewerId;
  const type = req.query.type;
  const itemsPerPage = req.query.limit ? Number(req.query.limit) : 4;
  const page = req.query.page ? Number(req.query.page) : 1;

  try {
    const contents = await prisma.content.findMany({
      where: {
        type: type.toUpperCase() as EContentType,
        groupId,
      },
      include: {
        author: {
          select: {
            userName: true,
          },
        },
        likes: {
          where: {
            userId: viewerId,
          },
        },
      },
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
    });

    const contentsWithLikes = contents.map((content) => ({
      ...content,
      isLiked: content.likes.length > 0,
      likes: undefined,
    }));

    const contentCount = await prisma.content.count({
      where: {
        groupId,
        type: type.toUpperCase() as EContentType,
      },
    });

    const totalPages = Math.ceil(contentCount / itemsPerPage);
    const hasNextPage = page < totalPages;

    res
      .status(200)
      .json({ contents: contentsWithLikes, totalPages, hasNextPage, page });
  } catch (error) {
    console.log('Error getting group', error);

    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const getGroupMembers = async (
  req: TypedRequest<typeof idSchema, typeof getGroupMembersSchema, any>,
  res: Response
) => {
  const groupId = req.params.id;
  const page = req.query.page ? Number(req.query.page) : 1;
  const role = req.query.role;
  const itemsPerPage = req.query.limit ? Number(req.query.limit) : 15;

  let where: { [key: string]: any } = {};

  try {
    if (role) {
      where = {
        role: role === 'user' ? Role.USER : Role.ADMIN,
      };
    }

    const fetchedMembers = await prisma.groupUser.findMany({
      where: {
        groupId,
        ...where,
      },
      select: {
        role: true,
        user: {
          select: {
            id: true,
            avatarImg: true,
            userName: true,
          },
        },
      },
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
    });
    const members = fetchedMembers.map((member) => ({
      role: member.role,
      ...member.user,
    }));

    const membersCount = await prisma.groupUser.count({
      where: {
        groupId,
        ...where,
      },
    });
    const totalPages = Math.ceil(membersCount / itemsPerPage);
    const hasNextPage = page < totalPages;

    res.status(200).json({ members, totalPages, hasNextPage });
  } catch (error) {
    console.log('Error getting group members', error);
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const joinGroup = async (
  req: TypedRequest<typeof idSchema, any, typeof joinOrLeaveGroupSchema>,
  res: Response
) => {
  const groupId = req.params.id;
  const viewerId = req.body.viewerId;

  try {
    await prisma.groupUser.create({
      data: {
        groupId,
        userId: viewerId,
      },
    });

    res.status(201).json({ message: 'User added to the group.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const leaveGroup = async (
  req: TypedRequest<typeof idSchema, any, typeof joinOrLeaveGroupSchema>,
  res: Response
) => {
  const groupId = req.params.id;
  const viewerId = req.body.viewerId;

  try {
    const existingMember = await prisma.groupUser.findUnique({
      where: {
        userId_groupId: { userId: viewerId, groupId },
      },
    });

    if (!existingMember)
      return res.status(404).json({ message: 'User not founded!' });

    await prisma.groupUser.delete({
      where: {
        userId_groupId: { userId: viewerId, groupId },
      },
    });

    res.status(200).json({ message: 'User removed from group.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const deleteGroup = async (
  req: TypedRequest<typeof idSchema, any, typeof viewerIdSchema>,
  res: Response
) => {
  const groupId = req.params.id;
  const viewerId = req.body.viewerId;

  console.log('groupId', groupId);
  console.log('viewerId', viewerId);

  try {
    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.authorId !== viewerId)
      return res
        .status(401)
        .json({ message: 'No permission to delete group!' });

    await prisma.group.delete({
      where: {
        id: groupId,
      },
    });

    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const removeUserFromGroup = async (
  req: TypedRequest<typeof idSchema, any, typeof groupMemebersActionsSchema>,
  res: Response
) => {
  try {
    const groupId = req.params.id;
    const { viewerId, userId: userToRemoveId } = req.body;

    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        members: true,
      },
    });

    if (!group) return res.status(404).json({ message: 'Group not found!' });

    const isAdmin = group?.members?.some(
      (member) => member.userId === viewerId && member.role === Role.ADMIN
    );

    if (!isAdmin)
      return res.status(403).json({
        message: 'You do not have permission to remove users from the group.',
      });

    await prisma.groupUser.delete({
      where: {
        userId_groupId: {
          userId: userToRemoveId,
          groupId,
        },
      },
    });

    res
      .status(200)
      .json({ message: 'User successfully removed from the group.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error!' });
  }
};
export const assignAdminRole = async (
  req: TypedRequest<typeof idSchema, any, typeof groupMemebersActionsSchema>,
  res: Response
) => {
  try {
    const groupId = req.params.id;
    const { viewerId, userId } = req.body;

    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        members: true,
      },
    });

    if (!group) return res.status(404).json({ message: 'Group not found!' });

    const isAdmin = group.members.some(
      (member) => member.userId === viewerId && member.role === Role.ADMIN
    );

    if (!isAdmin)
      return res.status(403).json({
        message: 'You do not have permission to remove users from the group.',
      });

    await prisma.groupUser.update({
      where: {
        userId_groupId: {
          groupId,
          userId,
        },
      },
      data: {
        role: Role.ADMIN,
      },
    });

    res.status(200).json({ message: 'Assigned admin role.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error!' });
  }
};

export const removeAdminRole = async (
  req: TypedRequest<typeof idSchema, any, typeof groupMemebersActionsSchema>,
  res: Response
) => {
  try {
    const groupId = req.params.id;
    const { viewerId, userId } = req.body;

    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        members: true,
      },
    });

    if (!group) return res.status(404).json({ message: 'Group not found!' });

    const isAdmin = group.members.some(
      (member) => member.userId === viewerId && member.role === Role.ADMIN
    );

    if (!isAdmin)
      return res.status(403).json({
        message: 'You do not have permission to remove users from the group.',
      });

    await prisma.groupUser.update({
      where: {
        userId_groupId: {
          groupId,
          userId,
        },
      },
      data: {
        role: Role.USER,
      },
    });

    res.status(200).json({ message: 'Removed admin role.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error!' });
  }
};

// getAllGroups ===> /groups GET ----> vraca group cards sa paginacijom
// getAllGroupsSidbarDetails ====> /groups/stats GET ---->  top racked, active groups, meetup podcasts posts
// getGroupById ===> /groups/:id GET ---> vraca SIDBAR detail za group-details page + data za group update page
// getGroupContent ====> /groups/:id/contents ----> vraca dinamicni content za specific group
// getGroupMembers ====> vraca sve membere (i admins i users)
