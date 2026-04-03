import { Link, Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { LayoutDashboard, Users } from 'lucide-react';
import { getMeQueryOptions } from '@/api/me';
import { LeftNavLayout } from '@/components/layouts/LeftNavLayout';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/_protected/_admin')({
  staticData: { hideFooter: true },
  beforeLoad: async ({ context }) => {
    const me = await context.queryClient.ensureQueryData(getMeQueryOptions(context.auth.getToken));
    if (!me || !me.roles.includes('admin')) throw redirect({ to: '/' });
  },
  component: AdminLayout,
});

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { to: '/admin/users', label: 'Users', icon: Users, exact: false },
] as const;

function AdminLayout() {
  return (
    <LeftNavLayout
      nav={(collapsed) => (
        <>
          {!collapsed && (
            <>
              <p className="px-2 py-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Admin
              </p>
              <Separator className="mb-1" />
            </>
          )}
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === '/admin' }}
              className={cn(
                'flex items-center rounded-md p-2 text-sm text-muted-foreground transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                '[&.active]:bg-accent [&.active]:font-medium [&.active]:text-accent-foreground',
                collapsed ? 'mx-auto size-8 justify-center' : 'gap-2',
              )}
            >
              <Icon size={16} className="shrink-0" />
              {!collapsed && label}
            </Link>
          ))}
        </>
      )}
    >
      <Outlet />
    </LeftNavLayout>
  );
}
