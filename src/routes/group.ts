import {
  createGroup,
  getAllGroups,
  getAllGroupsSidbarDetails,
  getGroupById,
  getGroupContent,
  getGroupMembers,
  joinGroup,
  leaveGroup,
  updateGroup,
} from '@/controllers/group-ctrl';
import { idSchema } from '@/lib/zod/common';
import {
  createGroupSchema,
  getAllGroupsSchema,
  getAllGroupsSidbarDetailsSchema,
  getGroupByIdSchema,
  getGroupContentSchema,
  getGroupMembersSchema,
  joinOrLeaveGroupSchema,
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
  '/stats',
  validateReqQuery(getAllGroupsSidbarDetailsSchema),
  getAllGroupsSidbarDetails
);

groupRoutes.get(
  '/:id',
  validateReqParams(idSchema),
  validateReqQuery(getGroupByIdSchema),
  getGroupById
);

groupRoutes.get(
  '/:id/members',
  validateReqParams(idSchema),
  validateReqQuery(getGroupMembersSchema),
  getGroupMembers
);

groupRoutes.post(
  '/:id/join',
  validateReqParams(idSchema),
  validateReqBody(joinOrLeaveGroupSchema),
  joinGroup
);

groupRoutes.delete(
  '/:id/leave',
  validateReqParams(idSchema),
  validateReqBody(joinOrLeaveGroupSchema),
  leaveGroup
);

groupRoutes.get(
  '/:id/content',
  validateReqParams(idSchema),
  validateReqQuery(getGroupContentSchema),
  getGroupContent
);

groupRoutes.post('/', validateReqBody(createGroupSchema), createGroup);

groupRoutes.patch(
  '/:id',
  validateReqParams(idSchema),
  validateReqBody(updateGroupSchema),
  updateGroup
);
