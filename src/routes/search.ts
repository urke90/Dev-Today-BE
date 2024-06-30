import { searchGroupsAndContents } from '@/controllers/search-ctrl';
import { searchQuerySchema } from '@/lib/zod/common';
import { validateReqQuery } from '@/utils/middlewares';
import express from 'express';

// ----------------------------------------------------------------

export const searchRoutes = express.Router();

searchRoutes.get(
  '/',
  searchGroupsAndContents,
  validateReqQuery(searchQuerySchema)
);
