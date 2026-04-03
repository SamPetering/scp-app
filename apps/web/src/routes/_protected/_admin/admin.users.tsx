import { User } from '@scp-app/shared/types';
import { createFileRoute } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useGetUsers, useUpdateUserRoles } from '@/api/admin';
import { useGetMe } from '@/api/me';
import { DataTable } from '@/components/DataTable';
import { PageLayout } from '@/components/layouts/PageLayout';
import { QueryPage } from '@/components/QueryPage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

export const Route = createFileRoute('/_protected/_admin/admin/users')({
  component: AdminUsers,
});

const col = createColumnHelper<User>();

function AdminUsersContent({ users }: { users: User[] }) {
  const { data: me } = useGetMe();
  const updateRoles = useUpdateUserRoles();
  const [search, setSearch] = useState('');

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const columns = [
    col.accessor('name', { header: 'Name' }),
    col.accessor('email', { header: 'Email' }),
    col.accessor('roles', {
      header: 'Roles',
      cell: ({ getValue }) => (
        <div className="flex gap-1">
          {getValue().map((role) => (
            <Badge key={role} variant={role === 'admin' ? 'default' : 'secondary'}>
              {role}
            </Badge>
          ))}
        </div>
      ),
    }),
    col.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const user = row.original;
        const isSelf = user.clerkId === me?.clerkId;
        const isAdmin = user.roles.includes('admin');

        if (isSelf) return <div className="h-7" />;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  updateRoles.mutate({
                    id: user.id,
                    roles: isAdmin
                      ? user.roles.filter((r) => r !== 'admin')
                      : [...user.roles, 'admin'],
                  })
                }
              >
                {isAdmin ? 'Remove admin' : 'Make admin'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>
      <Input
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      <DataTable columns={columns} data={filtered} />
    </div>
  );
}

function AdminUsers() {
  const query = useGetUsers();
  return (
    <QueryPage query={query} Layout={PageLayout}>
      {(users) => <AdminUsersContent users={users} />}
    </QueryPage>
  );
}
