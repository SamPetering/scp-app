import { createFileRoute } from '@tanstack/react-router';
import { PageLayout } from '@/components/PageLayout';

export const Route = createFileRoute('/_protected/me')({
  component: Me,
});

function Me() {
  const { me } = Route.useRouteContext();

  if (!me) return null;

  return (
    <PageLayout className="p-8">
      <h1 className="mb-4 text-2xl font-bold">me</h1>
      <dl className="space-y-2">
        <div>
          <dt className="text-sm text-muted-foreground">name</dt>
          <dd>{me.name}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">email</dt>
          <dd>{me.email}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">roles</dt>
          <dd>{me.roles.join(', ')}</dd>
        </div>
      </dl>
    </PageLayout>
  );
}
