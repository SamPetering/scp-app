import { z } from 'zod';
import { roleSchema, userSchema } from './schemas.js';

export type Role = z.infer<typeof roleSchema>;
export type User = z.infer<typeof userSchema>;
