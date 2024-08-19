import type { Response } from 'express';
import { TypedRequestQuery } from 'zod-express-middleware';

import { prisma } from '@/database/prisma-client';
import { searchQuerySchema } from '@/lib/zod/common';

// ----------------------------------------------------------------

export const searchGroupsAndContents = async (
  req: TypedRequestQuery<typeof searchQuerySchema>,
  res: Response
) => {
  const query = req.query.q;

  try {
    const groupsAndContents = await prisma.$queryRaw`
    SELECT * FROM (
        SELECT id, name AS title, NULL AS type 
        FROM "Group" 
        WHERE LOWER(name) ILIKE ${'%' + query + '%'}
        LIMIT 3
    ) AS group_results
    UNION ALL
    SELECT * FROM (
        SELECT id, title, CAST(type AS text) 
        FROM "Content" 
        WHERE LOWER(title) ILIKE ${'%' + query + '%'}
        LIMIT 3
    ) AS content_results
    LIMIT 6;
`;

    res.status(200).json(groupsAndContents);
  } catch (error) {
    console.log('Error fetching groups and contens', error);
  }
};
