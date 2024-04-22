import express from 'express';
import {
  getAllUsers,
  registerUser,
  loginUser,
  getUserById,
  loginUserWithProvider,
} from '../controllers/user-ctrl';
import { validateRequestBody } from 'zod-express-middleware';
import {
  loginSchema,
  registerSchema,
  loginProviderSchema,
} from '../lib/zod/user';

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
