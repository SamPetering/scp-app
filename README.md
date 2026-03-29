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

## Clerk setup

### 1. Create a Clerk application

Go to [clerk.com](https://clerk.com), create an application, and copy the API keys into your env files:

| Key | File |
| --- | ---- |
| `CLERK_PUBLISHABLE_KEY` | `apps/api/.env` |
| `CLERK_SECRET_KEY` | `apps/api/.env` |
| `VITE_CLERK_PUBLISHABLE_KEY` | `apps/web/.env` |

### 2. Configure webhooks

The API listens at `POST /webhooks/clerk` and syncs users to the database on `user.created`, `user.updated`, and `user.deleted` events.

In the Clerk dashboard → **Webhooks** → **Add endpoint**:

- **URL:** `https://<your-api-domain>/webhooks/clerk`
- **Events:** `user.created`, `user.updated`, `user.deleted`

After saving, copy the **Signing Secret** into `apps/api/.env`:

```
CLERK_WEBHOOK_SECRET=whsec_...
```

### 3. Local webhook testing

Use the [Svix CLI](https://docs.svix.com/receiving/using-app-portal/webhooks-cli) or [ngrok](https://ngrok.com) to forward webhooks to your local API:

```sh
ngrok http 3000
```

Then set the webhook endpoint URL in Clerk to your ngrok URL.
