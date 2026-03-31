#!/usr/bin/env node
// Run once after cloning: node scripts/init.js
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const c = {
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};

const log = {
  step: (msg) => console.log(`\n${c.bold(msg)}`),
  info: (msg) => console.log(`  ${c.dim('·')} ${msg}`),
  success: (msg) => console.log(`  ${c.green('✓')} ${msg}`),
  warn: (msg) => console.warn(`  ${c.yellow('!')} ${msg}`),
  error: (msg) => console.error(`  ${c.red('✗')} ${msg}`),
};

process.on('uncaughtException', (err) => {
  log.error(err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  log.error(err instanceof Error ? err.message : err);
  process.exit(1);
});

// ─── helpers ─────────────────────────────────────────────────────────────────

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', '.tanstack']);
const SKIP_FILES = new Set(['pnpm-lock.yaml']);

function* walkFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* walkFiles(path.join(dir, entry.name));
    } else if (!SKIP_FILES.has(entry.name)) {
      yield path.join(dir, entry.name);
    }
  }
}

// ─── steps ───────────────────────────────────────────────────────────────────

function checkTools(withGh) {
  const tools = withGh ? ['pnpm', 'git', 'gh'] : ['pnpm', 'git'];
  for (const tool of tools) {
    try {
      execSync(`which ${tool}`, { stdio: 'ignore' });
    } catch {
      log.error(`"${tool}" is required but not found in PATH`);
      process.exit(1);
    }
  }
}

function ensureGhAuth() {
  try {
    execSync('gh auth status', { stdio: 'ignore' });
  } catch {
    log.warn('GitHub CLI is not authenticated — launching gh auth login...');
    execSync('gh auth login', { stdio: 'inherit' });
  }
}

async function promptSetupRepo() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const input = (await rl.question('Create GitHub repository? (y/n) [y]: ')).trim().toLowerCase();
  rl.close();
  return input !== 'n';
}

async function promptName() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const defaultName = path.basename(root);
  const input = (await rl.question(`Project name (kebab-case) [${defaultName}]: `)).trim();
  rl.close();
  const name = input || defaultName;
  if (!/^[a-z][a-z0-9-]+$/.test(name)) {
    log.error('Invalid name. Use lowercase letters, numbers, and hyphens (e.g. my-project).');
    process.exit(1);
  }
  return name;
}

const SCAFFOLD_URL = 'https://github.com/SamPetering/scp-app';

function getTemplates(name) {
  return [
    {
      relPath: 'apps/web/src/routes/index.tsx',
      content: `import { createFileRoute } from '@tanstack/react-router';
import { PageLayout } from '@/components/PageLayout';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <PageLayout className="items-center justify-center">
      <h1 className="text-4xl font-bold">${name}</h1>
    </PageLayout>
  );
}
`,
    },
    {
      relPath: 'apps/web/src/routes/about.tsx',
      content: `import { createFileRoute } from '@tanstack/react-router';
import { PageLayout } from '@/components/PageLayout';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  return (
    <PageLayout className="items-center justify-center">
      <h1 className="text-4xl font-bold">about</h1>
    </PageLayout>
  );
}
`,
    },
    {
      relPath: 'apps/web/src/routes/tos.tsx',
      content: `import { createFileRoute } from '@tanstack/react-router';
import { PageLayout } from '@/components/PageLayout';

export const Route = createFileRoute('/tos')({
  component: Tos,
});

function Tos() {
  return (
    <PageLayout className="px-6 py-16">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="mb-8 text-2xl font-bold">Terms of Service</h1>
      </div>
    </PageLayout>
  );
}
`,
    },
    {
      relPath: 'apps/web/src/routes/privacy.tsx',
      content: `import { createFileRoute } from '@tanstack/react-router';
import { PageLayout } from '@/components/PageLayout';

export const Route = createFileRoute('/privacy')({
  component: Privacy,
});

function Privacy() {
  return (
    <PageLayout className="px-6 py-16">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="mb-8 text-2xl font-bold">Privacy Policy</h1>
      </div>
    </PageLayout>
  );
}
`,
    },
    {
      relPath: 'apps/web/index.html',
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
    <link rel="icon" href="/favicon.svg" />
    <script>
      if (
        localStorage.theme === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        document.documentElement.classList.add('dark');
      }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    },
    {
      relPath: 'README.md',
      content: `# ${name}

> Scaffolded from [scp-app](${SCAFFOLD_URL}). See the repo for full setup instructions.

## Structure

\`\`\`
${name}/
├── apps/
│   ├── api/      # Fastify REST API
│   └── web/      # Vite + React frontend
└── packages/
    └── shared/   # Shared Zod types
\`\`\`

## Stack

- **API** — Node.js, Fastify, Drizzle ORM, Neon Postgres, Clerk, Zod
- **Web** — React 19, Vite, TanStack Router & Query, Tailwind CSS, shadcn/ui, Clerk
- **Shared** — Zod schemas and types

## Scripts

| Command | Description |
| --- | --- |
| \`pnpm dev\` | Start all apps in watch mode |
| \`pnpm build\` | Build all apps |
| \`pnpm check\` | Lint + typecheck all packages |
| \`pnpm fmt\` | Format all packages |
`,
    },
    {
      relPath: 'apps/api/README.md',
      content: `# ${name}/api

> Scaffolded from [scp-app](${SCAFFOLD_URL}). See the repo for full setup instructions.

## Stack

Node.js · Fastify · Drizzle ORM · Neon Postgres · Clerk · Zod

## Scripts

| Command | Description |
| --- | --- |
| \`pnpm dev\` | Start with hot reload |
| \`pnpm build\` | Compile to \`dist/\` |
| \`pnpm start\` | Run compiled output |
| \`pnpm test\` | Run tests |
| \`pnpm check\` | Lint + typecheck + test |
| \`pnpm db:generate\` | Generate Drizzle migrations |
| \`pnpm db:migrate\` | Apply migrations locally |
`,
    },
    {
      relPath: 'apps/web/README.md',
      content: `# ${name}/web

> Scaffolded from [scp-app](${SCAFFOLD_URL}). See the repo for full setup instructions.

## Stack

React 19 · Vite · TanStack Router · TanStack Query · Tailwind CSS · shadcn/ui · Clerk

## Scripts

| Command | Description |
| --- | --- |
| \`pnpm dev\` | Start Vite dev server |
| \`pnpm build\` | Typecheck + build |
| \`pnpm preview\` | Preview production build |
| \`pnpm check\` | Lint + typecheck |
`,
    },
  ];
}

function renameProject(name, dryRun) {
  const OLD = 'scp-app';
  const templatedPaths = new Set(getTemplates(name).map((t) => t.relPath));
  log.step(`Renaming "${OLD}" → "${name}"...`);
  for (const filepath of walkFiles(root)) {
    if (templatedPaths.has(path.relative(root, filepath))) continue;
    let before;
    try {
      before = fs.readFileSync(filepath, 'utf8');
    } catch {
      continue; // skip binary files
    }
    if (!before.includes(OLD)) continue;
    const after = before.replaceAll(OLD, name);
    if (!dryRun) fs.writeFileSync(filepath, after);
    log.info(path.relative(root, filepath));
  }
}

function applyTemplates(name, dryRun) {
  log.step('Applying templates...');
  for (const { relPath, content } of getTemplates(name)) {
    if (!dryRun) fs.writeFileSync(path.join(root, relPath), content);
    log.info(relPath);
  }
}

function prepareEnv(dryRun) {
  log.step('Preparing environment...');

  const lockfile = path.join(root, 'pnpm-lock.yaml');
  if (fs.existsSync(lockfile)) {
    if (!dryRun) fs.unlinkSync(lockfile);
    log.info('deleted pnpm-lock.yaml (will be regenerated)');
  }

  for (const envExample of [
    path.join(root, 'apps/api/.env.example'),
    path.join(root, 'apps/web/.env.example'),
  ]) {
    const dest = envExample.replace('.env.example', '.env');
    if (!fs.existsSync(dest)) {
      if (!dryRun) fs.copyFileSync(envExample, dest);
      log.info(`created ${path.relative(root, dest)}`);
    }
  }
}

function install() {
  log.step('Installing dependencies...');
  try {
    execSync('pnpm install', { cwd: root, stdio: 'inherit' });
    return true;
  } catch {
    log.warn('pnpm install failed');
    return false;
  }
}

function format() {
  log.step('Formatting...');
  try {
    execSync('pnpm fmt', { cwd: root, stdio: 'inherit' });
  } catch {
    log.warn('pnpm fmt failed, skipping');
  }
}

function selfDelete() {
  fs.unlinkSync(__filename);
  try {
    fs.rmdirSync(__dirname);
  } catch {
    /* scripts/ not empty, leave it */
  }
}

function setupRepo(name) {
  log.step('Setting up repository...');
  fs.rmSync(path.join(root, '.git'), { recursive: true, force: true });
  execSync('git init', { cwd: root, stdio: 'inherit' });
  execSync('git add -A', { cwd: root, stdio: 'inherit' });
  execSync('git commit -m "init app"', { cwd: root, stdio: 'inherit' });
  try {
    execSync(`gh repo create ${name} --private --source=. --push`, { cwd: root, stdio: 'inherit' });
    log.success(`repo created and pushed → ${c.cyan(`github.com/${name}`)}`);
  } catch {
    log.warn('gh repo create failed — push manually when ready');
  }
}

function printDone(name, installOk, createRepo) {
  console.log(`\n${c.green(c.bold('✓'))} ${c.bold(`Project initialized as "${name}"`)}`);
  console.log(`\n${c.bold('Next steps:')}`);
  console.log(
    `  1. Fill in ${c.cyan('apps/api/.env')} and ${c.cyan('apps/web/.env')} with your keys`,
  );
  if (installOk) {
    console.log(`  2. ${c.cyan('pnpm dev')}`);
  } else {
    let step = 2;
    console.log(`  ${step++}. ${c.cyan('pnpm install')}`);
    console.log(`  ${step++}. ${c.cyan('pnpm fmt')}`);
    if (createRepo)
      console.log(`  ${step++}. ${c.cyan(`gh repo create ${name} --private --source=. --push`)}`);
    console.log(`  ${step++}. ${c.cyan('pnpm dev')}`);
  }
}

// ─── main ────────────────────────────────────────────────────────────────────

const dryRun = process.argv.includes('--dryRun');

const name = await promptName();
const createRepo = await promptSetupRepo();

checkTools(createRepo);
if (createRepo) ensureGhAuth();

renameProject(name, dryRun);
applyTemplates(name, dryRun);
prepareEnv(dryRun);

let installOk = true;
if (!dryRun) {
  installOk = install();
  if (installOk) format();
  selfDelete();
  if (installOk && createRepo) setupRepo(name);
}

printDone(name, installOk, createRepo);
