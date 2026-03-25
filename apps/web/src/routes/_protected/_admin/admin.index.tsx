import { User } from '@scp-app/shared/types';
import { createFileRoute } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { addWeeks, format, isAfter, isBefore, startOfWeek, subDays } from 'date-fns';
import { Users, UserPlus } from 'lucide-react';
import { useGetUsers } from '@/api/admin';
import { Chart } from '@/components/Chart';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute('/_protected/_admin/admin/')({
  component: AdminDashboard,
});

const col = createColumnHelper<User>();

const recentColumns = [
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
  col.accessor('createdAt', {
    header: 'Joined',
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{new Date(getValue()).toLocaleDateString()}</span>
    ),
  }),
];

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  valueClassName = 'text-4xl',
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  description?: string;
  valueClassName?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon size={16} className="text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className={`font-bold ${valueClassName}`}>{value}</p>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}

const signupsChartConfig = {
  count: { label: 'Signups', color: 'var(--chart-3)' },
};

function SignupsChart({ users }: { users: User[] }) {
  const now = new Date();
  const data = Array.from({ length: 8 }, (_, i) => {
    const start = startOfWeek(addWeeks(now, i - 7));
    const end = startOfWeek(addWeeks(now, i - 6));
    return {
      week: format(start, 'MMM d'),
      count: users.filter((u) => {
        const d = new Date(u.createdAt);
        return !isBefore(d, start) && isBefore(d, end);
      }).length,
    };
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Signups (last 8 weeks)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Chart data={data} config={signupsChartConfig} labelKey="week" className="h-32 w-full" />
      </CardContent>
    </Card>
  );
}

function AdminDashboard() {
  const { data, isPending, isError } = useGetUsers();

  if (isPending) return <div className="p-8 text-muted-foreground">loading...</div>;
  if (isError) return <div className="p-8 text-destructive">failed to load</div>;

  const users = data ?? [];
  const thirtyDaysAgo = subDays(new Date(), 30);
  const newCount = users.filter((u) => isAfter(new Date(u.createdAt), thirtyDaysAgo)).length;

  const sorted = [...users].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const latestUser = sorted[0] ?? null;
  const recent = sorted.slice(0, 5);

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold">Overview</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Users"
          value={users.length}
          icon={Users}
          description={`+${newCount} this month`}
        />
        <StatCard
          title="Latest Signup"
          value={latestUser?.name ?? '—'}
          icon={UserPlus}
          valueClassName="text-2xl"
          description={
            latestUser ? format(new Date(latestUser.createdAt), 'MMM d, yyyy') : undefined
          }
        />
        <SignupsChart users={users} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Recent Signups</h2>
        <DataTable columns={recentColumns} data={recent} />
      </div>
    </div>
  );
}
