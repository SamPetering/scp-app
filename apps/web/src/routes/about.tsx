import { createFileRoute } from '@tanstack/react-router';
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
