import type { Request, Response, RequestHandler } from 'express';
import prisma from '../prisma-client';
import { genSalt, hash, compare } from 'bcrypt';

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

interface IRegisterUserReqBody {
  name: string;
  email: string;
  password: string;
}

export const registerUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { name, email, password } = <IRegisterUserReqBody>req.body;

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
        name,
        email,
        password: hashPw,
      },
    });

    res.status(201).send('User created successfully!');
  } catch (error) {
    console.log('Error creating new user', error);
  }
};

interface ILoginUserReqBody {
  email: string;
  password: string;
}

export const loginUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { email, password } = <ILoginUserReqBody>req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser)
      return res.status(404).send('User with provided email not found!');

    if (!existingUser.password) throw new Error('User has no password!');

    if (!compare(existingUser.password, password))
      return res.status(400).send('You have entered wrong password!');

    res.status(200).send('Login successfull!');
  } catch (error) {
    console.log('Error logging in user', error);
  }
};

interface ILoginUserProviderReqBody {
  email: string;
}

export const loginUserWithProvider: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { email } = <ILoginUserProviderReqBody>req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser)
      return res.status(404).send('User with provided email not found!');

    res.status(200).send('Login successfull!');
  } catch (error) {
    console.log('Error logging in user', error);
  }
};
