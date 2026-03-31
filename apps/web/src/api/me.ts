import { userSchema } from '@scp-app/shared/types';
import { useQuery } from '@tanstack/react-query';
import useRequest from '@/hooks/useRequest';

export function useGetMe(enabled: boolean = true) {
  const request = useRequest();
  return useQuery({
    queryKey: ['me'],
    queryFn: () => request({ method: 'GET', url: '/me' }, userSchema),
    enabled,
  });
}
