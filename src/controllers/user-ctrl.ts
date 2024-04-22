import type { Request, Response, RequestHandler } from 'express';
import prisma from '../prisma-client';
import { genSalt, hash, compare } from 'bcrypt';
import { TypedRequestBody } from 'zod-express-middleware';
import {
  loginProviderSchema,
  loginSchema,
  registerSchema,
} from '../lib/zod/user';

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
  console.log('This should be /api/users/ route');

  console.log('req BODY', req.body);

  res.status(200).json({
    userId: 'RADI CONTROLLER KOJE SPLIT IZ ROUTES',
  });
};

export const registerUser: RequestHandler = async (
  req: TypedRequestBody<typeof registerSchema>,
  res: Response
) => {
  const { userName, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser)
      return res.status(409).send('User with provided email already exists!');

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
    console.log('Error creating new user', error);
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
      return res.status(404).send('User with provided email not found!');

    if (!existingUser.password) throw new Error('User has no password!');

    if (!(await compare(existingUser.password, password)))
      return res.status(400).send('You have entered wrong password!');

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
