import { clerkClient } from '@clerk/fastify';
import { Role, User } from '@scp-app/shared/types';
import { eq } from 'drizzle-orm';
import { db } from './db.js';
import { userRolesTable, usersTable } from './schema.js';

export async function getUser(clerkId: string) {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, clerkId),
    with: { roles: { columns: { role: true } } },
  });

  if (!user) return undefined;
  return { ...user, roles: user.roles.map((r) => r.role) };
}

export async function createUser({
  clerkId,
  email,
  name,
}: Pick<User, 'clerkId' | 'email' | 'name'>): Promise<User> {
  const [newUser] = await db.insert(usersTable).values({ clerkId, email, name }).returning();
  const [role] = await db
    .insert(userRolesTable)
    .values({ userId: newUser.id, role: 'user' })
    .returning();
  return { ...newUser, roles: [role.role] };
}

export async function updateUser(clerkId: string, email: string, name: string) {
  await db.update(usersTable).set({ email, name }).where(eq(usersTable.clerkId, clerkId));
}

export async function deleteUser(clerkId: string) {
  await db.delete(usersTable).where(eq(usersTable.clerkId, clerkId));
}

export async function setUserRoles(id: number, roles: Role[]): Promise<User> {
  await db.delete(userRolesTable).where(eq(userRolesTable.userId, id));
  if (roles.length > 0) {
    await db.insert(userRolesTable).values(roles.map((role) => ({ userId: id, role })));
  }
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, id),
    with: { roles: { columns: { role: true } } },
  });
  if (!user) throw new Error(`User ${id} not found`);
  return { ...user, roles: user.roles.map((r) => r.role) };
}

export async function getAllUsers(): Promise<User[]> {
  const users = await db.query.usersTable.findMany({
    with: { roles: { columns: { role: true } } },
  });
  return users.map((u) => ({ ...u, roles: u.roles.map((r) => r.role) }));
}

export async function findOrCreateUser(clerkId: string): Promise<User> {
  const existing = await getUser(clerkId);
  if (existing) return existing;

  const clerkUser = await clerkClient.users.getUser(clerkId);
  const email = clerkUser.emailAddresses.find(
    (e) => e.id === clerkUser.primaryEmailAddressId,
  )?.emailAddress;
  if (!email) throw new Error(`Clerk user ${clerkId} has no primary email`);

  const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ');

  return createUser({ name, clerkId, email });
}
