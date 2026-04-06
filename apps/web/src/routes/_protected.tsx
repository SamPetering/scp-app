import { useAuth } from '@clerk/react';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { HouseIcon, UserRoundCogIcon } from 'lucide-react';
import { useGetMe } from '@/api/me';
import { AppShellLayout, type NavSection } from '@/components/layouts/AppShellLayout';

export const Route = createFileRoute('/_protected')({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoaded && !context.auth.isSignedIn) {
      throw redirect({ to: '/' });
    }
  },
  component: ProtectedLayout,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">page not found</p>
    </div>
  );
}

function ProtectedLayout() {
  const { isSignedIn } = useAuth();
  const { data: me } = useGetMe();

  if (!isSignedIn) return null;

  const navSections: NavSection[] = [
    {
      to: '/home',
      label: 'Home',
      icon: HouseIcon,
      exact: false,
      items: [
        { to: '/home', label: 'Overview', exact: false },
        { to: '/profile', label: 'Profile', exact: false },
      ],
    },
    ...(me?.roles.includes('admin')
      ? [
          {
            to: '/admin',
            label: 'Admin',
            icon: UserRoundCogIcon,
            items: [
              { to: '/admin', label: 'Overview', exact: true },
              { to: '/admin/users', label: 'Users', exact: false },
            ],
          },
        ]
      : []),
  ];

  return (
    <AppShellLayout navSections={navSections}>
      <Outlet />
    </AppShellLayout>
  );
}
