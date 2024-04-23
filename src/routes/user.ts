import express, { type Request, type Response, NextFunction } from 'express';
import { validateRequestBody } from 'zod-express-middleware';

import { z } from 'zod';

import {
  loginSchema,
  loginProviderSchema,
  registerSchema,
  onboardingSchema,
} from '@/lib/zod/user';
import {
  getAllUsers,
  loginUser,
  getUserById,
  loginUserWithProvider,
  registerUser,
  // updateUserOnboarding,
} from '@/controllers/user-ctrl';

// ----------------------------------------------------------------

export const userRoutes = express.Router();

userRoutes.get('/', getAllUsers);

userRoutes.get('/:id', getUserById);

const validateBody =
  (schema: z.ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const bodyValidation = schema.safeParse(req.body);
    // @ts-ignore
    if (bodyValidation.error instanceof z.ZodError) {
      // @ts-ignore
      const validationError = bodyValidation.error.errors.map((error) => ({
        type: 'manual',
        name: error.path[0],
        message: error.message,
      }));

      return res.status(400).json(validationError);
    }

    next();
  };

userRoutes.post('/register', validateBody(registerSchema), registerUser);

userRoutes.post('/login', validateBody(loginSchema), loginUser);

userRoutes.post(
  '/login-provider',
  validateBody(loginProviderSchema),
  loginUserWithProvider
);

userRoutes.patch(
  '/:id/onboarding',
  validateBody(onboardingSchema)
  // updateUserOnboarding
);
