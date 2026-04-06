import { useAuth } from '@clerk/react';
import { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { getMeQueryOptions } from '@/api/me';

type RouterContext = {
  auth: ReturnType<typeof useAuth>;
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
  loader: ({ context: { auth, queryClient } }) => {
    queryClient.prefetchQuery(getMeQueryOptions(auth.getToken));
  },
});
