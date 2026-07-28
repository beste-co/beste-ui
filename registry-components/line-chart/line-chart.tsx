"use client";

import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
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

interface LineChartProps {
  data: Array<Record<string, string | number>>;
  /** Series config keyed by data field: { visitors: { label, color } } */
  config: ChartConfig;
  /** Category (x-axis) field */
  xKey: string;
  curve?: "natural" | "linear" | "monotone" | "step";
  /** Render a dot on each data point */
  dots?: boolean;
  showGrid?: boolean;
  showYAxis?: boolean;
  showLegend?: boolean;
  className?: string;
}

const lineChartConfig = {
  thisMonth: { label: "This month", color: "var(--chart-1)" },
  lastMonth: { label: "Last month", color: "var(--chart-2)" },
} satisfies ChartConfig;

export const lineChartDemo: LineChartProps = {
  xKey: "day",
  config: lineChartConfig,
  data: [
    { day: "1 Jan", thisMonth: 5200, lastMonth: 4300 },
    { day: "8 Jan", thisMonth: 6100, lastMonth: 5200 },
    { day: "15 Jan", thisMonth: 12324, lastMonth: 5563 },
    { day: "22 Jan", thisMonth: 9800, lastMonth: 7100 },
    { day: "29 Jan", thisMonth: 11200, lastMonth: 8600 },
  ],
};

export function LineChart({
  data,
  config,
  xKey,
  curve = "monotone",
  dots = false,
  showGrid = true,
  showYAxis = false,
  showLegend = false,
  className,
}: LineChartProps) {
  const series = Object.keys(config);

  return (
    <ChartContainer config={config} className={cn("aspect-video w-full", className)}>
      <RechartsLineChart data={data} margin={{ left: 12, right: 12, top: 12 }}>
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
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        {series.map((key) => (
          <Line
            key={key}
            dataKey={key}
            type={curve}
            stroke={`var(--color-${key})`}
            strokeWidth={2}
            dot={dots ? { fillOpacity: 1 } : false}
            activeDot={{ r: 4 }}
          />
        ))}
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
      </RechartsLineChart>
    </ChartContainer>
  );
}
