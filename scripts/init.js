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

const dryRun = process.argv.includes('--dryRun');

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

// Check required tools
for (const tool of ['pnpm', 'git', 'gh']) {
  try {
    execSync(`which ${tool}`, { stdio: 'ignore' });
  } catch {
    log.error(`"${tool}" is required but not found in PATH`);
    process.exit(1);
  }
}

// Ensure gh is authenticated
try {
  execSync('gh auth status', { stdio: 'ignore' });
} catch {
  log.warn('GitHub CLI is not authenticated — launching gh auth login...');
  execSync('gh auth login', { stdio: 'inherit' });
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const defaultName = path.basename(root);
const input = (await rl.question(`Project name (kebab-case) [${defaultName}]: `)).trim();
rl.close();
const name = input || defaultName;

if (!/^[a-z][a-z0-9-]+$/.test(name)) {
  log.error('Invalid name. Use lowercase letters, numbers, and hyphens (e.g. my-project).');
  process.exit(1);
}

const OLD = 'scp-app';

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

log.step(`Renaming "${OLD}" → "${name}"...`);

for (const filepath of walkFiles(root)) {
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

log.step('Applying templates...');

// Replace homepage with minimal template
const indexPath = path.join(root, 'apps/web/src/routes/index.tsx');
if (fs.existsSync(indexPath)) {
  const homepage = `import { createFileRoute } from '@tanstack/react-router';
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
`;
  if (!dryRun) fs.writeFileSync(indexPath, homepage);
  log.info('apps/web/src/routes/index.tsx');
}

// Replace about page with minimal template
const aboutPath = path.join(root, 'apps/web/src/routes/about.tsx');
if (fs.existsSync(aboutPath)) {
  const about = `import { createFileRoute } from '@tanstack/react-router';
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
`;
  if (!dryRun) fs.writeFileSync(aboutPath, about);
  log.info('apps/web/src/routes/about.tsx');
}

// Replace TOS with minimal template
const tosPath = path.join(root, 'apps/web/src/routes/tos.tsx');
if (fs.existsSync(tosPath)) {
  const tos = `import { createFileRoute } from '@tanstack/react-router';
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
`;
  if (!dryRun) fs.writeFileSync(tosPath, tos);
  log.info('apps/web/src/routes/tos.tsx');
}

// Replace privacy policy with minimal template
const privacyPath = path.join(root, 'apps/web/src/routes/privacy.tsx');
if (fs.existsSync(privacyPath)) {
  const privacy = `import { createFileRoute } from '@tanstack/react-router';
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
`;
  if (!dryRun) fs.writeFileSync(privacyPath, privacy);
  log.info('apps/web/src/routes/privacy.tsx');
}

log.step('Preparing environment...');

// Delete lockfile — package names changed, must regenerate
const lockfile = path.join(root, 'pnpm-lock.yaml');
if (fs.existsSync(lockfile)) {
  if (!dryRun) fs.unlinkSync(lockfile);
  log.info('deleted pnpm-lock.yaml (will be regenerated)');
}

// Copy .env.example → .env (skip if .env already exists)
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

let installOk = true;
if (!dryRun) {
  log.step('Installing dependencies...');
  try {
    execSync('pnpm install', { cwd: root, stdio: 'inherit' });
  } catch {
    installOk = false;
    log.warn('pnpm install failed');
  }

  if (installOk) {
    log.step('Formatting...');
    try {
      execSync('pnpm fmt', { cwd: root, stdio: 'inherit' });
    } catch {
      log.warn('pnpm fmt failed, skipping');
    }
  }
}

if (!dryRun) {
  // Self-delete
  fs.unlinkSync(__filename);
  try {
    fs.rmdirSync(__dirname);
  } catch {
    /* scripts/ not empty, leave it */
  }

  // Reset git history and push initial commit
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

console.log(`\n${c.green(c.bold('✓'))} ${c.bold(`Project initialized as "${name}"`)}`);
console.log(`\n${c.bold('Next steps:')}`);
console.log(
  `  1. Fill in ${c.cyan('apps/api/.env')} and ${c.cyan('apps/web/.env')} with your keys`,
);
if (installOk) {
  console.log(`  2. ${c.cyan('pnpm dev')}`);
} else {
  console.log(`  2. ${c.cyan('pnpm install')}`);
  console.log(`  3. ${c.cyan('pnpm dev')}`);
}
