import {
  createMeetup,
  createPodcast,
  createPost,
  getAllTags,
  getContent,
  updateMeetup,
  updatePodcast,
  updatePost,
} from '@/controllers/content-ctrl';
import { idSchema } from '@/lib/zod/common';
import {
  allContentQuerySchema,
  meetupSchema,
  podcastSchema,
  // createMeetupSchema,
  // createPodcastSchema,
  // createPostSchema,
  // updateMeetupSchema,
  // updatePodcastSchema,
  // updatePostSchema,
  postSchema,
} from '@/lib/zod/content';
import {
  validateReqBody,
  validateReqParams,
  validateReqQuery,
} from '@/utils/middlewares';
import express from 'express';

// ----------------------------------------------------------------

// 1. create Tags Model connect to Content
// 2. fix getGroups for Dropdown with limit
// 3. fix return num of items for Content

export const contentRoutes = express.Router();

contentRoutes.get('/', validateReqQuery(allContentQuerySchema), getContent);

contentRoutes.get('/tags', getAllTags);

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
