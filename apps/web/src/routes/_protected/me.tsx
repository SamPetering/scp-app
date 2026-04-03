import { createFileRoute } from '@tanstack/react-router';
import { useGetMe } from '@/api/me';
import { PageLayout } from '@/components/layouts/PageLayout';
import { QueryPage } from '@/components/QueryPage';

export const Route = createFileRoute('/_protected/me')({
  component: Me,
});

function Me() {
  const query = useGetMe();
  return (
    <PageLayout>
      <QueryPage query={query}>
        {(me) => (
          <>
            <h1 className="mb-4 w-full text-2xl font-bold">me</h1>
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
          </>
        )}
      </QueryPage>
    </PageLayout>
  );
}
