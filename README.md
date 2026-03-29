# scp-app

Fullstack monorepo template — Fastify API + Vite/React frontend.

## Using this template

```sh
git clone https://github.com/you/scp-app my-project
cd my-project
node scripts/init.js
```

The init script will:

1. Prompt for a project name (kebab-case)
2. Replace all occurrences of `scp-app` with your project name across the repo
3. Delete `pnpm-lock.yaml` so it is regenerated with the new package names
4. Copy `apps/api/.env.example` → `apps/api/.env` and `apps/web/.env.example` → `apps/web/.env`
5. Self-delete (`scripts/init.js` is removed when done)

After init, fill in your env files and run:

```sh
pnpm install
pnpm dev
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
- **Deployment:** API → Railway, Web → Cloudflare Pages

## Scripts

| Command          | Description                      |
| ---------------- | -------------------------------- |
| `pnpm dev:api`   | Start the API dev server         |
| `pnpm dev:web`   | Start the web dev server         |
| `pnpm build`     | Build all apps                   |
| `pnpm fmt`       | Format all files with oxfmt      |
| `pnpm fmt:check` | Check formatting without writing |

See [`apps/api`](apps/api/README.md) and [`apps/web`](apps/web/README.md) for full setup instructions.
