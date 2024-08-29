import express from 'express';

// import { validateRequestParams } from 'zod-express-middleware';

import {
  deleteUser,
  followUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  getUserContent,
  getUserGroups,
  loginUser,
  loginUserWithProvider,
  registerUser,
  unfollowUser,
  updateUserOnboarding,
  updateUserProfile,
} from '@/controllers/user-ctrl';
import { idSchema } from '@/lib/zod/common';
import {
  getUserContentTypeSchema,
  getUserGroupSchema,
  loginProviderSchema,
  loginSchema,
  onboardingSchema,
  paramsEmailSchema,
  profileSchema,
  registerSchema,
  userIdSchema,
} from '@/lib/zod/user';
import {
  validateReqBody,
  validateReqParams,
  validateReqQuery,
} from '@/utils/middlewares';

export const userRoutes = express.Router();

userRoutes.patch(
  '/:id/onboarding',
  validateReqBody(onboardingSchema),
  updateUserOnboarding
);

userRoutes.get('/', getAllUsers);

userRoutes.get(
  '/:id/content',
  validateReqParams(idSchema),
  validateReqQuery(getUserContentTypeSchema),
  getUserContent
);

userRoutes.get(
  '/:id/groups',
  validateReqParams(idSchema),
  validateReqQuery(getUserGroupSchema),
  getUserGroups
);

userRoutes.post(
  '/:id/follow',
  validateReqParams(idSchema),
  validateReqBody(userIdSchema),
  followUser
);

userRoutes.delete(
  '/:id/unfollow',
  validateReqParams(idSchema),
  validateReqBody(userIdSchema),
  unfollowUser
);

userRoutes.get(
  '/email/:email',
  validateReqParams(paramsEmailSchema),
  getUserByEmail
);

userRoutes.post('/register', validateReqBody(registerSchema), registerUser);

userRoutes.post('/login', validateReqBody(loginSchema), loginUser);

userRoutes.post(
  '/login-provider',
  validateReqBody(loginProviderSchema),
  loginUserWithProvider
);

userRoutes.delete('/:id', validateReqParams(idSchema), deleteUser);

userRoutes.get(
  '/:id',
  validateReqParams(idSchema),
  validateReqQuery(profileSchema),
  getUserById
);

userRoutes.patch(
  '/:id',
  validateReqParams(idSchema),
  validateReqBody(profileSchema),
  updateUserProfile
);
