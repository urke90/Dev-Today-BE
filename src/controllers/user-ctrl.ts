import type { Request, Response, RequestHandler } from 'express';
import { prisma, Prisma } from '@/database/prisma-client';
import { genSalt, hash, compare } from 'bcrypt';
import {
  type TypedRequestBody,
  sendErrors,
  TypedRequest,
} from 'zod-express-middleware';
import {
  loginProviderSchema,
  loginSchema,
  registerSchema,
  paramsIdSchema,
  onboardingSchema,
} from '@/lib/zod/user';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// ----------------------------------------------------------------

export const getUserById: RequestHandler<{ id: string }> = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return res.status(404).send('User not found!');

    res.status(200).json({ user });
  } catch (error) {
    console.log('Error fetching user with id', error);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Get all users!',
  });
};

export const registerUser: RequestHandler = async (
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

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.log('Error registering user!', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res
          .status(409)
          .json({ message: 'User with provided email already exists!' });
      }
    }
  }
};

export const loginUser: RequestHandler = async (
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

    if (!(await compare(existingUser.password, password)))
      return res
        .status(400)
        .json({ message: 'You have entered wrong password!' });

    res.status(200).json({ user: existingUser });
  } catch (error) {
    console.log('Error logging in user', error);
  }
};

export const loginUserWithProvider: RequestHandler = async (
  req: TypedRequestBody<typeof loginProviderSchema>,
  res: Response
) => {
  const { email } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser)
      return res.status(404).send('User with provided email not found!');

    res.status(200).json({ user: existingUser });
  } catch (error) {
    console.log('Error logging in user', error);
  }
};

export const updateUserOnboarding = async (
  // TODO: have to fix "any" since
  req: TypedRequest<typeof paramsIdSchema, any, typeof onboardingSchema>,
  res: Response
) => {
  const id = req.params.id;
  const { codingAmbitions, currentKnowledge, preferredSkills, isOnboarding } =
    req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        codingAmbitions,
        currentKnowledge,
        preferredSkills,
        isOnboarding,
      },
    });

    // console.log('updatedUser', updatedUser);
    res.status(201).json({ user: updatedUser });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res.status(404).json({ message: 'User not found!' });
      }
    }
  }
};
