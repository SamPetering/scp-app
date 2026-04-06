import { UserProfile } from '@clerk/react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected/profile')({
  component: ProfileComponent,
});

function ProfileComponent() {
  return <UserProfile routing="path" path="/profile" />;
}
