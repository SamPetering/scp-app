import { createFileRoute } from '@tanstack/react-router';
import { PageLayout } from '@/components/layouts/PageLayout';

export const Route = createFileRoute('/_public/tos')({
  component: Tos,
});

function Tos() {
  return (
    <PageLayout className="px-6 py-16">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="mb-8 text-2xl font-bold">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">
          scp-app is built by one code monkey doing their best. By using it, you agree not to misuse
          the service. That's it.
        </p>
      </div>
    </PageLayout>
  );
}
