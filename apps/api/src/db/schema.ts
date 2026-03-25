import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, primaryKey, timestamp, varchar } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['admin', 'user']);

export const usersTable = pgTable(
  'users', // plural because 'user' is a reserved keyword in postgres
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
    email: varchar({ length: 255 }).notNull().unique(),
    name: varchar({ length: 255 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
);

export const userRolesTable = pgTable(
  'users_role',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    role: roleEnum('role').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.role] })],
);

export const usersRelations = relations(usersTable, ({ many }) => ({
  roles: many(userRolesTable),
}));

export const userRolesRelations = relations(userRolesTable, ({ one }) => ({
  user: one(usersTable, { fields: [userRolesTable.userId], references: [usersTable.id] }),
}));
