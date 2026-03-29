import { createFileRoute } from '@tanstack/react-router';
import { PageLayout } from '@/components/PageLayout';

export const Route = createFileRoute('/privacy')({
  component: Privacy,
});

function Privacy() {
  return (
    <PageLayout className="px-6 py-16">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="mb-8 text-2xl font-bold">Privacy Policy</h1>

        <div className="space-y-6 text-sm text-muted-foreground">
          <p>
            Last updated:{' '}
            {new Date('2026-03-30').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Information we collect</h2>
            <p>
              When you sign in, we collect your name and email address. This information is provided
              through your chosen sign-in method (e.g. Google) and stored in our database.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">How we use it</h2>
            <p>
              Your name and email are used solely to identify your account and provide the service.
              We do not sell or share your data with third parties for marketing purposes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Third-party services</h2>
            <p>
              We use{' '}
              <a href="https://clerk.com" className="underline hover:text-foreground">
                Clerk
              </a>{' '}
              for authentication and{' '}
              <a href="https://neon.tech" className="underline hover:text-foreground">
                Neon
              </a>{' '}
              for data storage. Your data is subject to their respective privacy policies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Data deletion</h2>
            <p>
              You can delete your account at any time. Deleting your account removes all associated
              data from our database.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">Contact</h2>
            <p>
              For privacy-related questions, open an issue on{' '}
              <a
                href="https://github.com/SamPetering/scp-app/issues"
                className="underline hover:text-foreground"
              >
                GitHub
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
