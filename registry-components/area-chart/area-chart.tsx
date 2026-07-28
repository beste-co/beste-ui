"use client";

import {
  Area,
  AreaChart as RechartsAreaChart,
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

interface AreaChartProps {
  data: Array<Record<string, string | number>>;
  /** Series config keyed by data field: { revenue: { label, color } } */
  config: ChartConfig;
  /** Category (x-axis) field */
  xKey: string;
  /** Stack the areas instead of overlaying them */
  stacked?: boolean;
  /** Smooth ("natural") vs straight ("linear") curves */
  curve?: "natural" | "linear" | "monotone" | "step";
  showGrid?: boolean;
  showYAxis?: boolean;
  showLegend?: boolean;
  className?: string;
}

const areaChartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  orders: { label: "Orders", color: "var(--chart-2)" },
} satisfies ChartConfig;

export const areaChartDemo: AreaChartProps = {
  xKey: "month",
  config: areaChartConfig,
  stacked: true,
  data: [
    { month: "Jan", revenue: 4200, orders: 2400 },
    { month: "Feb", revenue: 3800, orders: 2100 },
    { month: "Mar", revenue: 5100, orders: 2900 },
    { month: "Apr", revenue: 4700, orders: 2600 },
    { month: "May", revenue: 6200, orders: 3400 },
    { month: "Jun", revenue: 7400, orders: 3900 },
  ],
};

export function AreaChart({
  data,
  config,
  xKey,
  stacked = false,
  curve = "natural",
  showGrid = true,
  showYAxis = false,
  showLegend = false,
  className,
}: AreaChartProps) {
  const series = Object.keys(config);

  return (
    <ChartContainer config={config} className={cn("aspect-video w-full", className)}>
      <RechartsAreaChart data={data} margin={{ left: 12, right: 12, top: 12 }}>
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
        <defs>
          {series.map((key) => (
            <linearGradient
              key={key}
              id={`fill-${key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={`var(--color-${key})`}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={`var(--color-${key})`}
                stopOpacity={0.08}
              />
            </linearGradient>
          ))}
        </defs>
        {series.map((key) => (
          <Area
            key={key}
            dataKey={key}
            type={curve}
            stroke={`var(--color-${key})`}
            fill={`url(#fill-${key})`}
            strokeWidth={2}
            stackId={stacked ? "a" : undefined}
          />
        ))}
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
      </RechartsAreaChart>
    </ChartContainer>
  );
}
