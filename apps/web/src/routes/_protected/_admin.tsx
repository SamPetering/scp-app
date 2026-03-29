import { LeftNavLayout } from '@/components/LeftNavLayout';
import { Link, Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { LayoutDashboard, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const Route = createFileRoute('/_protected/_admin')({
  beforeLoad: async ({ context }) => {
    const { me } = context;
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
      nav={
        <>
          <p className="px-2 py-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Admin
          </p>
          <Separator className="mb-1" />
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === '/admin' }}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              activeProps={{
                className:
                  'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm bg-accent text-accent-foreground font-medium transition-colors',
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </>
      }
    >
      <Outlet />
    </LeftNavLayout>
  );
}
