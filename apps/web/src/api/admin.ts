import { Role, User, userSchema } from '@scp-app/shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useRequest from '@/hooks/useRequest';
import { optimistic } from '@/lib/optimistic';

const usersQueryKey = ['admin', 'users'] as const;

export function useGetUsers() {
  const request = useRequest();
  return useQuery({
    queryKey: usersQueryKey,
    queryFn: () => request({ method: 'GET', url: '/admin/users' }, userSchema.array()),
  });
}

type UserRolesArgs = { id: number; roles: Role[] };
export function useUpdateUserRoles() {
  const request = useRequest();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, roles }: UserRolesArgs) =>
      request({ method: 'PATCH', url: `/admin/users/${id}/roles`, data: { roles } }, userSchema),
    ...optimistic<User[], UserRolesArgs>(queryClient, { queryKey: usersQueryKey }, (users, args) =>
      users.map((u) => (u.id === args.id ? { ...u, roles: args.roles } : u)),
    ),
  });
}
