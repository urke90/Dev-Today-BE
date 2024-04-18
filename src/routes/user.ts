import express from 'express';
import {
  getAllUsers,
  registerUser,
  loginUser,
  getUserById,
  loginUserWithProvider,
} from '../controllers/user-ctrl';

export const userRoutes = express.Router();

userRoutes.get('/', getAllUsers);

userRoutes.get('/:id', getUserById);

userRoutes.post('/register', registerUser);

userRoutes.post('/login', loginUser);

userRoutes.post('/login-provider', loginUserWithProvider);
