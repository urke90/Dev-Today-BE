import {
  createGroup,
  getAllGroups,
  getGroupsForDropdown,
  updateGroup,
} from '@/controllers/group-ctrl';
import { idSchema } from '@/lib/zod/common';
import {
  createGroupSchema,
  groupNameQuery,
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

groupRoutes.get('/', getAllGroups);

groupRoutes.get(
  '/content-create',
  validateReqQuery(groupNameQuery),
  getGroupsForDropdown
);

groupRoutes.post('/', validateReqBody(createGroupSchema), createGroup);

groupRoutes.patch(
  '/:id',
  validateReqParams(idSchema),
  validateReqBody(updateGroupSchema),
  updateGroup
);
