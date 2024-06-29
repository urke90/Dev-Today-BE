import express from 'express';

// import { validateRequestParams } from 'zod-express-middleware';

import {
  createLike,
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
  updateUserOnboarding,
  updateUserProfile,
} from '@/controllers/user-ctrl';
import {
  createLikeSchema,
  getUserContentTypeSchema,
  getUserGroupSchema,
  loginProviderSchema,
  loginSchema,
  onboardingSchema,
  paramsEmailSchema,
  paramsIdSchema,
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

userRoutes.get('/', getAllUsers);

userRoutes.get(
  '/:id',
  validateReqParams(paramsIdSchema),
  validateReqQuery(profileSchema),
  getUserById
);

userRoutes.get(
  '/:id/content',
  validateReqParams(paramsIdSchema),
  validateReqQuery(getUserContentTypeSchema),
  getUserContent
);
userRoutes.post(
  '/content/:id/like',
  validateReqParams(paramsIdSchema),
  validateReqBody(createLikeSchema),
  createLike
);

userRoutes.get(
  '/:id/groups',
  validateReqParams(paramsIdSchema),
  validateReqQuery(getUserGroupSchema),
  getUserGroups
);

userRoutes.post(
  '/:id/follow',
  validateReqParams(paramsIdSchema),
  validateReqBody(userIdSchema),
  followUser
);

userRoutes.patch(
  '/:id',
  validateReqParams(paramsIdSchema),
  validateReqBody(profileSchema),
  updateUserProfile
);

userRoutes.get(
  '/email/:email',
  validateReqParams(paramsEmailSchema),
  getUserByEmail
);

userRoutes.post('/register', validateReqBody(registerSchema), registerUser);

userRoutes.delete('/:id', validateReqParams(paramsIdSchema), deleteUser);

userRoutes.post('/login', validateReqBody(loginSchema), loginUser);

userRoutes.post('/login-provider', validateReqBody(loginProviderSchema));
userRoutes.post('/register', validateReqBody(registerSchema), registerUser);

userRoutes.post('/login', validateReqBody(loginSchema), loginUser);

userRoutes.post(
  '/login-provider',
  validateReqBody(loginProviderSchema),
  loginUserWithProvider
);

userRoutes.patch(
  '/:id/onboarding',
  validateReqBody(onboardingSchema),
  updateUserOnboarding
);
