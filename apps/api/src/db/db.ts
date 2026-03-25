import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { requireVariable } from '../utils/env.js';
import * as schema from './schema.js';

const sql = neon(requireVariable('DATABASE_URL'));
export const db = drizzle({ client: sql, schema });
