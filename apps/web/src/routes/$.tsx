import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$')({
  component: NotFound,
});

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">page not found</p>
    </div>
  );
}
