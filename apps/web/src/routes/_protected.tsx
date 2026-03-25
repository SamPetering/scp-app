import { useAuth } from '@clerk/react';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected')({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoaded && !context.auth.isSignedIn) {
      throw redirect({ to: '/' });
    }
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) return null;
  return <Outlet />;
}
