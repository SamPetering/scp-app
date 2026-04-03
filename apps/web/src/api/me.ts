import { useAuth } from '@clerk/react';
import { userSchema } from '@scp-app/shared/types';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { makeRequest } from '@/hooks/useRequest';

export function getMeQueryOptions(getToken: () => Promise<string | null>) {
  return queryOptions({
    queryKey: ['me'],
    queryFn: () => makeRequest(getToken, { method: 'GET', url: '/me' }, userSchema),
  });
}

export function useGetMe() {
  const { getToken } = useAuth();
  return useQuery(getMeQueryOptions(getToken));
}
