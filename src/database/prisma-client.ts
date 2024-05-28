import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  log: [{ level: 'query', emit: 'stdout' }],
});

// -------------------------------------------------------------

export { Prisma, prisma };
