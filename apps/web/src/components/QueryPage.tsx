import { UseQueryResult } from '@tanstack/react-query';
import { JSX, ComponentType, ReactNode } from 'react';
import { PageLayout } from '@/components/layouts/PageLayout';
import { Spinner } from '@/components/Spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function QueryPage<T>({
  query,
  Layout = PageLayout,
  loader,
  children,
}: {
  query: UseQueryResult<T>;
  Layout?: ComponentType<{ children: ReactNode }>;
  loader?: JSX.Element;
  children: (data: T) => JSX.Element;
}) {
  const { data, isLoading, isError } = query;
  return (
    <Layout>
      {isLoading && (loader ?? <Spinner className="my-auto size-8 self-center" />)}
      {isError && (
        <Alert variant="destructive" className="my-auto w-fit self-center">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{query.error?.message}</AlertDescription>
        </Alert>
      )}
      {!isLoading && !isError && children(data as T)}
    </Layout>
  );
}
