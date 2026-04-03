import { UseQueryResult } from '@tanstack/react-query';
import { JSX } from 'react';
import { Spinner } from '@/components/Spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function QueryPage<T>({
  query,
  loader,
  children,
}: {
  query: UseQueryResult<T>;
  loader?: JSX.Element;
  children: (data: T) => JSX.Element;
}) {
  const { data, isLoading, isError } = query;
  if (isLoading) return loader ?? <Spinner className="my-auto size-8 self-center" />;
  if (isError)
    return (
      <Alert variant="destructive" className="my-auto w-fit self-center">
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>{query.error?.message}</AlertDescription>
      </Alert>
    );
  return children(data as T);
}
