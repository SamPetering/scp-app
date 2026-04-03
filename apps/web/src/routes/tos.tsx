import { createFileRoute } from '@tanstack/react-router';
import { PageLayout } from '@/components/layouts/PageLayout';

export const Route = createFileRoute('/tos')({
  component: Tos,
});

function Tos() {
  return (
    <PageLayout className="px-6 py-16">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="mb-8 text-2xl font-bold">Terms of Service</h1>

        <div className="space-y-6 text-sm text-muted-foreground">
          <p>
            Last updated:{' '}
            {new Date('2026-03-30').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          <p>By using this service, you agree to the following terms:</p>

          <ol className="list-decimal space-y-3 pl-5">
            <li>You will not deploy on a Friday.</li>
            <li>You will not deploy on a Friday afternoon.</li>
            <li>
              You will not deploy on a Friday afternoon before a long weekend, no matter how
              "trivial" the change.
            </li>
            <li>
              You will not push directly to <code className="text-foreground">main</code> and call
              it a "quick fix."
            </li>
            <li>
              You will not push directly to <code className="text-foreground">main</code> at all.
              You know who you are.
            </li>
            <li>
              You acknowledge that "it works on my machine" is not a valid deployment strategy.
              Shipping your machine is not a valid workaround.
            </li>
            <li>
              You will not write <code className="text-foreground">// TODO: fix this later</code>{' '}
              and submit a PR. "Later" has never come for any TODO in the history of software.
            </li>
            <li>
              You will write tests. Eventually. At some point. Maybe. Before prod breaks, ideally.
            </li>
            <li>
              You accept that every estimate should be multiplied by three. If you already
              multiplied by three, multiply again.
            </li>
            <li>
              You will not name a variable <code className="text-foreground">data</code>,{' '}
              <code className="text-foreground">data2</code>, or{' '}
              <code className="text-foreground">dataFinal</code>.
            </li>
            <li>
              You acknowledge that <code className="text-foreground">console.log</code> debugging is
              valid, but you will remove it before merging. We've all seen your{' '}
              <code className="text-foreground">console.log("HERE 2")</code>.
            </li>
            <li>
              You accept that the documentation is wrong. You will not fix it. Neither will anyone
              else. This is the way.
            </li>
          </ol>

          <p>Violation of these terms may result in code review comments.</p>
        </div>
      </div>
    </PageLayout>
  );
}
