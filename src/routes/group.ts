import { createGroup, updateGroup } from '@/controllers/group-ctrl';
import express from 'express';

// ----------------------------------------------------------------

export const groupRoutes = express.Router();

groupRoutes.post('/', createGroup);

groupRoutes.patch('/:id', updateGroup);
