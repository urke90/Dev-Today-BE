import {
  createComment,
  createMeetup,
  createPodcast,
  createPost,
  createUpdateCommentLike,
  deleteComment,
  getAllComments,
  getAllTags,
  getContent,
  getContentById,
  getContentStatsSidebar,
  updateComment,
  updateMeetup,
  updatePodcast,
  updatePost,
} from '@/controllers/content-ctrl';
import { idSchema, viewerIdSchema } from '@/lib/zod/common';
import {
  allContentQuerySchema,
  commentsSchema,
  getAllContentSidebarDetailsSchema,
  meetupSchema,
  podcastSchema,
  postSchema,
  tagsTitleSchema,
  updateMeetupSchema,
  updatePostSchema,
} from '@/lib/zod/content';
import {
  validateReqBody,
  validateReqParams,
  validateReqQuery,
} from '@/utils/middlewares';
import express from 'express';
import {
  validateRequestBody,
  validateRequestParams,
} from 'zod-express-middleware';

// ----------------------------------------------------------------

export const contentRoutes = express.Router();

contentRoutes.get('/', validateReqQuery(allContentQuerySchema), getContent);

contentRoutes.get('/tags', validateReqQuery(tagsTitleSchema), getAllTags);

contentRoutes.get(
  '/stats',
  validateReqQuery(getAllContentSidebarDetailsSchema),
  getContentStatsSidebar
);

contentRoutes.get('/:id', validateReqParams(idSchema), getContentById);

/***************************************************************** CREATE ********************************************************** */

contentRoutes.post('/post', validateReqBody(postSchema), createPost);

contentRoutes.post('/meetup', validateReqBody(meetupSchema), createMeetup);

contentRoutes.post('/podcast', validateReqBody(podcastSchema), createPodcast);

/***************************************************************** CREATE ********************************************************** */

/***************************************************************** UPDATE ********************************************************** */

contentRoutes.patch(
  '/post/:id',
  validateReqParams(idSchema),
  validateReqQuery(viewerIdSchema),
  validateReqBody(updatePostSchema),
  updatePost
);

contentRoutes.patch(
  '/meetup/:id',
  validateReqParams(idSchema),
  validateReqQuery(viewerIdSchema),
  validateReqBody(updateMeetupSchema),
  updateMeetup
);

contentRoutes.patch(
  '/podcast/:id',
  validateReqParams(idSchema),
  validateReqQuery(viewerIdSchema),
  validateReqBody(updatePostSchema),
  updatePodcast
);

/***************************************************************** COMMENTS ********************************************************** */

contentRoutes.post('/comment', validateReqBody(commentsSchema), createComment);

contentRoutes.patch(
  '/comment/update',
  validateRequestBody(commentsSchema),
  updateComment
);
contentRoutes.delete(
  '/comment/delete',
  validateRequestBody(idSchema),
  deleteComment
);

contentRoutes.post(
  '/comment/like',
  validateReqBody(idSchema),
  createUpdateCommentLike
);

contentRoutes.get(
  '/:id/comment',
  validateRequestParams(idSchema),
  validateReqQuery(viewerIdSchema),
  getAllComments
);
