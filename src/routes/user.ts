import express from 'express';
// import { validateRequestParams } from 'zod-express-middleware';
import {
  validateUserReqParams,
  validateUserReqQuery,
} from '@/utils/middlewares';
import { validateUserReqBody } from '@/utils/middlewares';
import {
  loginSchema,
  loginProviderSchema,
  registerSchema,
  onboardingSchema,
  paramsEmailSchema,
  profileSchema,
  paramsIdSchema,
  typeSchema,
  contentSchema,
  getUserGroupSchema,
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
  getUserContent,
  createLike,
  deleteUser,
  followUser,
  getUserGroups,
} from '@/controllers/user-ctrl';

export const userRoutes = express.Router();

userRoutes.get('/', getAllUsers);

userRoutes.get(
  '/:id',
  validateUserReqParams(paramsIdSchema),
  validateUserReqBody(profileSchema),
  getUserById
);

userRoutes.get(
  '/:id/content',
  validateUserReqParams(paramsIdSchema),
  validateUserReqQuery(typeSchema),
  getUserContent
);

userRoutes.post(
  '/:id/like',
  validateUserReqParams(paramsIdSchema),
  validateUserReqBody(contentSchema),
  createLike
);

userRoutes.get(
  '/:id/groups',
  validateUserReqParams(paramsIdSchema),
  validateUserReqQuery(getUserGroupSchema),
  getUserGroups
);

userRoutes.post(
  '/:id/follow',
  validateUserReqBody(paramsIdSchema),
  validateUserReqBody(profileSchema),
  followUser
);

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

userRoutes.delete('/:id', validateUserReqParams(paramsIdSchema), deleteUser);

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
