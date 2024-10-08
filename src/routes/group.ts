import express from 'express';

import {
  assignAdminRole,
  createGroup,
  deleteGroup,
  getAllGroups,
  getAllGroupsSidbarDetails,
  getGroupById,
  getGroupContent,
  getGroupMembers,
  joinGroup,
  leaveGroup,
  removeAdminRole,
  removeUserFromGroup,
  updateGroup,
} from '@/controllers/group-ctrl';
import { idSchema, viewerIdSchema } from '@/lib/zod/common';
import {
  createGroupSchema,
  getAllGroupsSchema,
  getAllGroupsSidbarDetailsSchema,
  getGroupByIdSchema,
  getGroupContentSchema,
  getGroupMembersSchema,
  groupMemebersActionsSchema,
  joinOrLeaveGroupSchema,
  updateGroupSchema,
} from '@/lib/zod/group';
import {
  validateReqBody,
  validateReqParams,
  validateReqQuery,
} from '@/utils/middlewares';

// ----------------------------------------------------------------

export const groupRoutes = express.Router();

groupRoutes.get('/', validateReqQuery(getAllGroupsSchema), getAllGroups);

groupRoutes.get(
  '/stats',
  validateReqQuery(getAllGroupsSidbarDetailsSchema),
  getAllGroupsSidbarDetails
);

groupRoutes.delete(
  '/:id/delete',
  validateReqParams(idSchema),
  validateReqBody(viewerIdSchema),
  deleteGroup
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

groupRoutes.delete(
  '/:id/user',
  validateReqParams(idSchema),
  validateReqBody(groupMemebersActionsSchema),
  removeUserFromGroup
);

groupRoutes.post(
  '/:id/admin',
  validateReqParams(idSchema),
  validateReqBody(groupMemebersActionsSchema),
  assignAdminRole
);

groupRoutes.delete(
  '/:id/admin',
  validateReqParams(idSchema),
  validateReqBody(groupMemebersActionsSchema),
  removeAdminRole
);

groupRoutes.get(
  '/:id/content',
  validateReqParams(idSchema),
  validateReqQuery(getGroupContentSchema),
  getGroupContent
);

groupRoutes.post('/', validateReqBody(createGroupSchema), createGroup);

groupRoutes.get(
  '/:id',
  validateReqParams(idSchema),
  validateReqQuery(getGroupByIdSchema),
  getGroupById
);

groupRoutes.patch(
  '/:id',
  validateReqParams(idSchema),
  validateReqBody(updateGroupSchema),
  updateGroup
);
