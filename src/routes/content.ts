import {
  createMeetup,
  createPodcast,
  createPost,
  getAllTags,
  getContent,
  getContentById,
  updateMeetup,
  updatePodcast,
  updatePost,
} from '@/controllers/content-ctrl';
import { idSchema } from '@/lib/zod/common';
import {
  allContentQuerySchema,
  meetupSchema,
  podcastSchema,
  postSchema,
  tagsTitleSchema,
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

contentRoutes.get('/tags', validateReqQuery(tagsTitleSchema), getAllTags);

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
  validateReqBody(postSchema),
  updatePost
);

contentRoutes.patch(
  '/meetup/:id',
  validateReqParams(idSchema),
  validateReqBody(meetupSchema),
  updateMeetup
);

contentRoutes.patch(
  '/podcast/:id',
  validateReqParams(idSchema),
  validateReqBody(podcastSchema),
  updatePodcast
);

/***************************************************************** UPDATE ********************************************************** */
