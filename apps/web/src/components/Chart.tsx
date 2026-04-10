import { Bar, BarChart, XAxis } from 'recharts';
import { ChartConfig } from '@/components/ui/chart';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface ChartProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
  labelKey: string;
  className?: string;
}

export function Chart({ data, config, labelKey, className }: ChartProps) {
  return (
    <ChartContainer config={config} className={className}>
      <BarChart data={data}>
        <XAxis dataKey={labelKey} tickLine={true} axisLine={true} tickMargin={4} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {Object.keys(config).map((k) => (
          <Bar key={k} dataKey={k} fill={`var(--color-${k})`} radius={2} />
        ))}
      </BarChart>
    </ChartContainer>
  );
}
