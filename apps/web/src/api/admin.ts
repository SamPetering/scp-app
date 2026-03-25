import { Role, userSchema } from '@scp-app/shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useRequest from '@/hooks/useRequest';

export function useGetUsers() {
  const request = useRequest();
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => request({ method: 'GET', url: '/admin/users' }, userSchema.array()),
  });
}

export function useUpdateUserRoles() {
  const request = useRequest();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, roles }: { id: number; roles: Role[] }) =>
      request({ method: 'PATCH', url: `/admin/users/${id}/roles`, data: { roles } }, userSchema),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}
