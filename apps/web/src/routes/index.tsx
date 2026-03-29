import { createFileRoute } from '@tanstack/react-router';
import { PageLayout } from '@/components/PageLayout';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <PageLayout className="items-center justify-center">
      <h1 className="text-4xl font-bold">scp-app</h1>
    </PageLayout>
  );
}
