import { QueryClient, QueryKey } from '@tanstack/react-query';

/**
 * Generates optimistic update handlers for a `useMutation` call.
 *
 * Immediately applies `updater` to the cached query data on mutation start,
 * rolls back on error, and revalidates on settled.
 *
 * @example
 * useMutation({
 *   mutationFn: ...,
 *   ...optimistic<User[], { id: number; roles: Role[] }>(queryClient, { queryKey }, (users, { id, roles }) =>
 *     users.map((u) => (u.id === id ? { ...u, roles } : u)),
 *   ),
 * })
 *
 * @remarks
 * For complex cases (multiple queries, paginated data), write
 * `onMutate`/`onError`/`onSettled` manually instead.
 */
export function optimistic<TData, TVariables>(
  queryClient: QueryClient,
  opts: { queryKey: QueryKey },
  updater: (old: TData, variables: TVariables) => TData,
) {
  return {
    onMutate: async (variables: TVariables) => {
      await queryClient.cancelQueries(opts);
      const previous = queryClient.getQueryData<TData>(opts.queryKey);
      queryClient.setQueryData<TData>(opts.queryKey, (old) =>
        old !== undefined ? updater(old, variables) : old,
      );
      return { previous };
    },
    onError: (_err: unknown, _vars: TVariables, ctx?: { previous: TData | undefined }) => {
      if (ctx?.previous !== undefined) queryClient.setQueryData(opts.queryKey, ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries(opts),
  };
}
