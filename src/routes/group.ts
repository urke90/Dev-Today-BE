import {
  createGroup,
  getAllGroups,
  updateGroup,
} from '@/controllers/group-ctrl';
import { idSchema } from '@/lib/zod/common';
import { createGroupSchema, updateGroupSchema } from '@/lib/zod/group';
import { validateReqBody, validateReqParams } from '@/utils/middlewares';
import express from 'express';

// ----------------------------------------------------------------

export const groupRoutes = express.Router();

groupRoutes.get('/', getAllGroups);

groupRoutes.post('/', validateReqBody(createGroupSchema), createGroup);

groupRoutes.patch(
  '/:id',
  validateReqParams(idSchema),
  validateReqBody(updateGroupSchema),
  updateGroup
);
