import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { getMeQueryOptions } from '@/api/me';

export const Route = createFileRoute('/_protected/_admin')({
  beforeLoad: async ({ context }) => {
    const me = await context.queryClient.ensureQueryData(getMeQueryOptions(context.auth.getToken));
    if (!me || !me.roles.includes('admin')) throw redirect({ to: '/' });
  },
  component: () => <Outlet />,
});
