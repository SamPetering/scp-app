import { z } from 'zod';

export const roleSchema = z.enum(['admin', 'user']);

export const userSchema = z.object({
  id: z.number(),
  clerkId: z.string(),
  email: z.email(),
  name: z.string(),
  createdAt: z.coerce.date(),
  roles: z.array(roleSchema),
});
