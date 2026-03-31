import './instrument.ts';
import './index.css';
import { useAuth } from '@clerk/react';
import { ClerkProvider } from '@clerk/react';
import { shadcn } from '@clerk/ui/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { LoaderCircleIcon } from 'lucide-react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { useGetMe } from '@/api/me';
import { routeTree } from './routeTree.gen';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const queryClient = new QueryClient();

export const router = createRouter({
  routeTree,
  context: { auth: undefined!, me: undefined!, queryClient },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  const getMe = useGetMe(!!auth.isSignedIn);

  // if user is signed in, wait for /me request and add it to the router context
  if (!auth.isLoaded || (auth.isSignedIn && getMe.isLoading))
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderCircleIcon className="animate-spin text-muted-foreground" />
      </div>
    );

  const me = getMe.data ?? null;

  return <RouterProvider router={router} context={{ auth, queryClient, me }} />;
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider appearance={{ theme: shadcn }} publishableKey={PUBLISHABLE_KEY}>
          <InnerApp />
        </ClerkProvider>
        <ReactQueryDevtools />
        <TanStackRouterDevtools position="bottom-right" router={router} />
      </QueryClientProvider>
    </StrictMode>,
  );
}
