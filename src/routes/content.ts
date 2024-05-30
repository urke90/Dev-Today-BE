import {
  createMeetup,
  createPodcast,
  createPost,
  getContent,
  getContentTags,
  updateMeetup,
  updatePodcast,
  updatePost,
} from '@/controllers/content-ctrl';
import { idSchema } from '@/lib/zod/common';
import {
  allContentQuerySchema,
  createMeetupSchema,
  createPodcastSchema,
  createPostSchema,
  updateMeetupSchema,
  updatePodcastSchema,
  updatePostSchema,
} from '@/lib/zod/content';
import {
  validateReqBody,
  validateReqParams,
  validateReqQuery,
} from '@/utils/middlewares';
import express from 'express';

// ----------------------------------------------------------------

export const contentRoutes = express.Router();

contentRoutes.get('/', validateReqQuery(allContentQuerySchema), getContent);

contentRoutes.get('/:id/tags', validateReqParams(idSchema), getContentTags);

/***************************************************************** CREATE ********************************************************** */

contentRoutes.post('/post', validateReqBody(createPostSchema), createPost);

contentRoutes.post(
  '/meetup',
  validateReqBody(createMeetupSchema),
  createMeetup
);

contentRoutes.post(
  '/podcast',
  validateReqBody(createPodcastSchema),
  createPodcast
);

/***************************************************************** CREATE ********************************************************** */

/***************************************************************** UPDATE ********************************************************** */

contentRoutes.patch(
  '/post/:id',
  validateReqParams(idSchema),
  validateReqBody(updatePostSchema),
  updatePost
);

contentRoutes.patch(
  '/meetup/:id',
  validateReqParams(idSchema),
  validateReqBody(updateMeetupSchema),
  updateMeetup
);

contentRoutes.patch(
  '/podcast/:id',
  validateReqParams(idSchema),
  validateReqBody(updatePodcastSchema),
  updatePodcast
);

/***************************************************************** UPDATE ********************************************************** */
