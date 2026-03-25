# scp-app

Fullstack monorepo template — Fastify API + Vite/React frontend.

## Using this template

```sh
git clone https://github.com/you/scp-app my-project
cd my-project
node scripts/init.js
pnpm install
cp apps/api/.env.example apps/api/.env
```

## Structure

```
apps/
  api/        # Fastify REST API
  web/        # Vite + React frontend
packages/
  shared/     # Shared types (Zod)
```

## Stack

- **Package manager:** pnpm workspaces
- **API:** Node.js + TypeScript, Fastify, Drizzle ORM, Neon (Postgres), Clerk auth
- **Web:** Vite, React, TypeScript
- **Deployment:** Railway

## Scripts

| Command          | Description                      |
| ---------------- | -------------------------------- |
| `pnpm dev:api`   | Start the API dev server         |
| `pnpm dev:web`   | Start the web dev server         |
| `pnpm build`     | Build all apps                   |
| `pnpm fmt`       | Format all files with oxfmt      |
| `pnpm fmt:check` | Check formatting without writing |

See [`apps/api`](apps/api/README.md) and [`apps/web`](apps/web/README.md) for full setup instructions.
