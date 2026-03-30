import { createFileRoute } from '@tanstack/react-router';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';
import { InputField } from '@/components/InputField';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import useClipboard from '@/hooks/useClipboard';

export const Route = createFileRoute('/')({
  component: Index,
});

const GITHUB_URL = 'https://github.com/SamPetering/scp-app';

function Index() {
  const [projectName, setProjectName] = useState('my-project');
  const name = projectName.trim() || 'my-project';

  function handleProjectNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (val === '' || /^[a-zA-Z0-9._-]+$/.test(val)) {
      setProjectName(val);
    }
  }

  return (
    <PageLayout className="items-center">
      <div className="flex w-full max-w-3xl flex-col items-center gap-8">
        {/* Header */}
        <div className="relative z-1 bg-background">
          <div className="border-animation" />
          <div className="rounded-b-xl bg-background">
            <div className="flex flex-col gap-3 rounded-b-xl border border-t-0 bg-muted/10 px-6 py-8 text-center">
              <h1 className="text-4xl font-bold">scp-app</h1>
              <p className="text-lg text-balance text-muted-foreground">
                Fullstack monorepo template — Fastify API + Vite/React frontend with auth, a
                database, and deployment configs ready to go.
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {[
                  'Node.js',
                  'Fastify',
                  'Drizzle ORM',
                  'Neon',
                  'Clerk',
                  'Vite',
                  'React',
                  'TypeScript',
                  'Railway',
                  'Cloudflare Pages',
                ].map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto flex items-center gap-2 text-chart-3 hover:underline"
              >
                <GitHubIcon />
                SamPetering/scp-app
              </a>
            </div>
          </div>
        </div>

        {/* Getting started */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 border-b pb-4">
            <h2 className="text-xl font-semibold">Get started</h2>
            <InputField
              inputProps={{
                type: 'text',
                value: projectName,
                onChange: handleProjectNameChange,
                placeholder: 'my-project',
                id: 'project-name',
              }}
              className="ml-auto max-w-64"
            />
          </div>

          <Step n={1} title="Clone and init">
            <CodeBlock>{`git clone ${GITHUB_URL} ${name}\ncd ${name}\nnode scripts/init.js`}</CodeBlock>
            <p className="text-sm text-muted-foreground">
              The init script prompts for a project name, replaces all{' '}
              <code className="rounded bg-muted px-1 text-xs">scp-app</code> references, copies{' '}
              <code className="rounded bg-muted px-1 text-xs">.env.example</code> files, and removes
              itself.
            </p>
          </Step>

          <Step n={2} title="Push to GitHub">
            <CodeBlock>{`gh repo create ${name} --private --source=. --remote=origin --push`}</CodeBlock>
          </Step>

          <Step n={3} title="Fill in env vars and run">
            <p className="text-sm text-muted-foreground">
              Add your Clerk and Neon dev keys to{' '}
              <code className="rounded bg-muted px-1 text-xs">apps/api/.env</code> and{' '}
              <code className="rounded bg-muted px-1 text-xs">apps/web/.env</code>, then:
            </p>
            <CodeBlock>{`pnpm dev`}</CodeBlock>
          </Step>

          <Step n={4} title="Deploy" isLast>
            <p className="text-sm text-muted-foreground">
              Deploy the API to{' '}
              <a
                href="https://railway.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                Railway
              </a>{' '}
              and the frontend to{' '}
              <a
                href="https://pages.cloudflare.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                Cloudflare Pages
              </a>
              . See the{' '}
              <a
                href={GITHUB_URL + '#readme'}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                README
              </a>{' '}
              for the full setup guide.
            </p>
          </Step>
        </div>
      </div>
    </PageLayout>
  );
}

function Step({
  n,
  title,
  children,
  isLast = false,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex size-6 shrink-0 items-center justify-center rounded-full border border-chart-2 text-sm font-semibold text-chart-2">
          {n}
        </div>
        {!isLast && <div className="mt-1 w-px grow bg-border" />}
      </div>
      <div className="flex w-full min-w-0 flex-col gap-2 pb-4">
        <p className="font-medium">{title}</p>
        {children}
      </div>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  const { copy, copied } = useClipboard();
  return (
    <div className="relative w-full">
      <pre className="w-full overflow-x-auto rounded-md bg-muted px-4 py-3 pr-10 text-sm text-wrap">
        <code>{children}</code>
      </pre>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={() => copy(children)}
        className="absolute top-2 right-2"
        title="Copy to clipboard"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
