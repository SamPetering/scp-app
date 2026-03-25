import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { requireVariable } from '../utils/env.js';

const sql = neon(requireVariable('DATABASE_URL'));
const db = drizzle(sql);

await migrate(db, { migrationsFolder: './migrations' });
console.log('Migrations complete');
