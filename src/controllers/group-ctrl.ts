import { prisma, Prisma } from '@/database/prisma-client';
// import uui

import { createGroupSchema } from '@/lib/zod/group';
import { Role } from '@prisma/client';
import { Request, Response } from 'express';
import { TypedRequestBody } from 'zod-express-middleware';

// ----------------------------------------------------------------

// model GroupUser {
//   user    User   @relation(fields: [userId], references: [id])
//   userId  String
//   group   Group  @relation(fields: [groupId], references: [id])
//   groupId String
//   role    Role   @default(USER)

//   @@id([userId, groupId])
// }

/**
 * SOLITIONS
 * 1. SQL radio bih 2 inster inot
 * 2. napravitit custom ID i  2 insert-a sa tim ID
 * 3. Napraviti query za create Group pa korisiti dalje created group id za novi crate
 * U OBA SLUCAJA KORISTITI TRANSAKCIJU
 */

export const createGroup = async (
  req: TypedRequestBody<typeof createGroupSchema>,
  res: Response
) => {
  const { authorId, members, name, bio, coverImage, profileImage } = req.body;
  // const groupId = uuidv4();

  const newMembers =
    members?.filter((member) => member.userId !== authorId) || [];

  try {
    const newGroup = await prisma.group.create({
      data: {
        // id: groupId,
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

    console.log('newGroup', newGroup);

    res.status(201).json({ newGroup });
  } catch (error) {
    console.log('Error creating group', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
    }
  }
};

export const updateGroup = (req: Request, res: Response) => {};
