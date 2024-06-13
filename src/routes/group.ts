import {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
} from '@/controllers/group-ctrl';
import { idSchema } from '@/lib/zod/common';
import {
  createGroupSchema,
  getAllGroupsSchema,
  getGroupByIdSchema,
  updateGroupSchema,
} from '@/lib/zod/group';
import {
  validateReqBody,
  validateReqParams,
  validateReqQuery,
} from '@/utils/middlewares';
import express from 'express';

// ----------------------------------------------------------------

export const groupRoutes = express.Router();

groupRoutes.get('/', validateReqQuery(getAllGroupsSchema), getAllGroups);

groupRoutes.get(
  '/:id',
  validateReqParams(idSchema),
  validateReqQuery(getGroupByIdSchema),
  getGroupById
);

groupRoutes.post('/', validateReqBody(createGroupSchema), createGroup);

groupRoutes.patch(
  '/:id',
  validateReqParams(idSchema),
  validateReqBody(updateGroupSchema),
  updateGroup
);
