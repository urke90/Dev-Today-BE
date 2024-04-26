import type { Request, Response } from 'express';
import { prisma, Prisma } from '@/database/prisma-client';
import { genSalt, hash, compare } from 'bcrypt';
import {
  type TypedRequestBody,
  type TypedRequestParams,
  TypedRequest,
} from 'zod-express-middleware';
import {
  loginProviderSchema,
  loginSchema,
  registerSchema,
  paramsIdSchema,
  onboardingSchema,
  paramsEmailSchema,
} from '@/lib/zod/user';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { excludeField, excludeProperty } from '@/utils/prisma-functions';

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

export const getAllUsers = async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Get all users!',
  });
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
        res
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
