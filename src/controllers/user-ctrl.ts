import type { Request, Response, RequestHandler } from "express";
import { prisma, Prisma } from "@/database/prisma-client";
import { genSalt, hash, compare } from "bcrypt";
import {
  type TypedRequestBody,
  sendErrors,
  TypedRequest,
} from "zod-express-middleware";
import { type ZodError, fromZodError, errorMap } from "zod-validation-error";
import { z } from "zod";
import {
  loginProviderSchema,
  loginSchema,
  registerSchema,
  paramsIdSchema,
  onboardingSchema,
} from "@/lib/zod/user";

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

    if (!user) return res.status(404).send("User not found!");

    res.status(200).json({ user });
  } catch (error) {
    console.log("Error fetching user with id", error);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Get all users!",
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
  } catch (error: any) {
    console.log("Error registering user!", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        res
          .status(409)
          .json({ message: "User with provided email already exists!" });
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
        .json({ message: "User with provided email not found!" });

    if (!existingUser.password) throw new Error("User has no password!");

    if (!(await compare(existingUser.password, password)))
      return res
        .status(400)
        .json({ message: "You have entered wrong password!" });

    res.status(200).json({ user: existingUser });
  } catch (error) {
    console.log("Error logging in user", error);
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
      return res.status(404).send("User with provided email not found!");

    res.status(200).json({ user: existingUser });
  } catch (error) {
    console.log("Error logging in user", error);
  }
};

export const updateUser = async (
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
      data: {},
    });
  } catch (error) {
    console.log("Error");
  }
};
