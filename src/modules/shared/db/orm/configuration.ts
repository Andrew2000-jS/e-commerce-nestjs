import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

export const configurations = (): PrismaPg => {
  const URL = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString: URL });
  const adapter = new PrismaPg(pool);
  return adapter;
};
