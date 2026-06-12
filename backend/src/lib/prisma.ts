/**
 * A single shared PrismaClient instance for the whole app.
 *
 * Prisma manages its own connection pool, so we create exactly one client and
 * import it wherever we need database access (repositories). Creating many
 * clients would exhaust database connections.
 */

import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
