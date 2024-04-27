import express from 'express';
import { validateRequestParams } from 'zod-express-middleware';
import { validateUserReqBody } from '@/utils/middlewares';
import {
  loginSchema,
  loginProviderSchema,
  registerSchema,
  onboardingSchema,
  paramsEmailSchema,
  profileSchema,
} from '@/lib/zod/user';
import {
  getAllUsers,
  loginUser,
  getUserByEmail,
  loginUserWithProvider,
  registerUser,
  updateUserOnboarding,
  getUserById,
  updateUserProfile,
} from '@/controllers/user-ctrl';

export const userRoutes = express.Router();

userRoutes.get('/', getAllUsers);

userRoutes.get('/:id', validateRequestParams(profileSchema), getUserById);

userRoutes.patch(
  '/:id',
  validateRequestParams(profileSchema),
  updateUserProfile
);

userRoutes.get(
  '/:email',
  validateRequestParams(paramsEmailSchema),
  getUserByEmail
);

userRoutes.post('/register', validateUserReqBody(registerSchema), registerUser);

userRoutes.post('/login', validateUserReqBody(loginSchema), loginUser);

userRoutes.post(
  '/login-provider',
  validateUserReqBody(loginProviderSchema),
  loginUserWithProvider
);

userRoutes.patch(
  '/:id/onboarding',
  validateUserReqBody(onboardingSchema),
  updateUserOnboarding
);
