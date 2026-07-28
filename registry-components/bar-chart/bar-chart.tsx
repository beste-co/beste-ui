"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface BarChartProps {
  data: Array<Record<string, string | number>>;
  /** Series config keyed by data field: { desktop: { label, color } } */
  config: ChartConfig;
  /** Category (x-axis) field */
  xKey: string;
  /** Stack the bars instead of grouping them side by side */
  stacked?: boolean;
  /** Corner radius on the bars */
  radius?: number;
  showGrid?: boolean;
  showYAxis?: boolean;
  showLegend?: boolean;
  className?: string;
}

const barChartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig;

export const barChartDemo: BarChartProps = {
  xKey: "month",
  config: barChartConfig,
  data: [
    { month: "Jan", desktop: 186, mobile: 80 },
    { month: "Feb", desktop: 305, mobile: 200 },
    { month: "Mar", desktop: 237, mobile: 120 },
    { month: "Apr", desktop: 173, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "Jun", desktop: 264, mobile: 140 },
  ],
};

export function BarChart({
  data,
  config,
  xKey,
  stacked = false,
  radius = 6,
  showGrid = true,
  showYAxis = false,
  showLegend = false,
  className,
}: BarChartProps) {
  const series = Object.keys(config);

  return (
    <ChartContainer config={config} className={cn("aspect-video w-full", className)}>
      <RechartsBarChart data={data} margin={{ left: 12, right: 12, top: 12 }}>
        {showGrid && <CartesianGrid vertical={false} />}
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        {showYAxis && (
          <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} />
        )}
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        {series.map((key) => (
          <Bar
            key={key}
            dataKey={key}
            fill={`var(--color-${key})`}
            radius={radius}
            stackId={stacked ? "a" : undefined}
          />
        ))}
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
      </RechartsBarChart>
    </ChartContainer>
  );
}
