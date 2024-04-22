import express from 'express';
import { validateRequestBody } from 'zod-express-middleware';

import {
  loginSchema,
  loginProviderSchema,
  registerSchema,
} from '@/lib/zod/user';
import {
  getAllUsers,
  loginUser,
  getUserById,
  loginUserWithProvider,
  registerUser,
} from '@/controllers/user-ctrl';

// ----------------------------------------------------------------

export const userRoutes = express.Router();

userRoutes.get('/', getAllUsers);

userRoutes.get('/:id', getUserById);

userRoutes.post('/register', validateRequestBody(registerSchema), registerUser);

userRoutes.post('/login', validateRequestBody(loginSchema), loginUser);

userRoutes.post(
  '/login-provider',
  validateRequestBody(loginProviderSchema),
  loginUserWithProvider
);
