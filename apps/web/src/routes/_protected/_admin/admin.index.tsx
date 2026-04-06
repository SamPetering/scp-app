import { User } from '@scp-app/shared/types';
import { createFileRoute } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { addWeeks, format, isAfter, isBefore, startOfWeek, subDays } from 'date-fns';
import { Users } from 'lucide-react';
import { useGetUsers } from '@/api/admin';
import { Chart } from '@/components/Chart';
import { DataTable } from '@/components/DataTable';
import { QueryPage } from '@/components/QueryPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute('/_protected/_admin/admin/')({
  component: AdminDashboard,
});

const col = createColumnHelper<User>();

const recentColumns = [
  col.accessor('name', { header: 'Name' }),
  col.accessor('email', { header: 'Email' }),
  col.accessor('createdAt', {
    header: 'Joined',
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{new Date(getValue()).toLocaleDateString()}</span>
    ),
  }),
];

function StatCard({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon size={16} className="text-muted-foreground" />}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

const signupsChartConfig = {
  count: { label: 'Signups', color: 'var(--chart-3)' },
};

function SignupsChart({ users, className }: { users: User[]; className?: string }) {
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
    <StatCard title="Signups (last 8 weeks)" className={className}>
      <Chart data={data} config={signupsChartConfig} labelKey="week" className="h-32 w-full" />
    </StatCard>
  );
}

function AdminDashboardContent({ users }: { users: User[] }) {
  const thirtyDaysAgo = subDays(new Date(), 30);
  const newCount = users.filter((u) => isAfter(new Date(u.createdAt), thirtyDaysAgo)).length;
  const sorted = [...users].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const recent = sorted.slice(0, 5);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <StatCard title="Total Users" icon={Users} className="md:col-span-1">
          <>
            <p className="text-6xl font-bold">{users.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">{`+${newCount} this month`}</p>
          </>
        </StatCard>
        <SignupsChart users={users} className="md:col-span-2" />
        <StatCard title="Recent Signups" icon={Users} className="md:col-span-2">
          <DataTable columns={recentColumns} data={recent} variant="minimal" size="xs" />
        </StatCard>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const query = useGetUsers();
  return <QueryPage query={query}>{(users) => <AdminDashboardContent users={users} />}</QueryPage>;
}
