import express from 'express';
// import { validateRequestParams } from 'zod-express-middleware';
import { validateUserReqParams } from '@/utils/middlewares';
import { validateUserReqBody } from '@/utils/middlewares';
import {
  loginSchema,
  loginProviderSchema,
  registerSchema,
  onboardingSchema,
  paramsEmailSchema,
  profileSchema,
  paramsIdSchema,
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

userRoutes.get('/:id', validateUserReqParams(paramsIdSchema), getUserById);
// userRoutes.get('/:id/content', validateUserReqParams(paramsIdSchema), getUserById);

userRoutes.patch(
  '/:id',
  validateUserReqParams(paramsIdSchema),
  validateUserReqBody(profileSchema),
  updateUserProfile
);

userRoutes.get(
  '/:email',
  validateUserReqParams(paramsEmailSchema),
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
