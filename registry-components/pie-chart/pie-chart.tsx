"use client";

import { Cell, Pie, PieChart as RechartsPieChart } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface PieChartProps {
  data: Array<Record<string, string | number>>;
  /** Config keyed by the nameKey values: { chrome: { label, color } } */
  config: ChartConfig;
  /** Numeric field that sizes each slice */
  dataKey: string;
  /** Field whose value picks the slice color (--color-{value}) and label */
  nameKey: string;
  /** Inner radius as a fraction (0 = full pie, 0.6 = donut) */
  donut?: number;
  showLegend?: boolean;
  className?: string;
}

const pieChartConfig = {
  retailers: { label: "Retailers", color: "var(--chart-1)" },
  distributors: { label: "Distributors", color: "var(--chart-2)" },
  wholesalers: { label: "Wholesalers", color: "var(--chart-3)" },
} satisfies ChartConfig;

export const pieChartDemo: PieChartProps = {
  dataKey: "value",
  nameKey: "segment",
  donut: 0.55,
  showLegend: true,
  config: pieChartConfig,
  data: [
    { segment: "retailers", value: 2884 },
    { segment: "distributors", value: 1432 },
    { segment: "wholesalers", value: 562 },
  ],
};

export function PieChart({
  data,
  config,
  dataKey,
  nameKey,
  donut = 0,
  showLegend = false,
  className,
}: PieChartProps) {
  return (
    <ChartContainer
      config={config}
      className={cn("mx-auto aspect-square max-h-72 w-full", className)}
    >
      <RechartsPieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey={nameKey} />}
        />
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          innerRadius={donut ? `${Math.round(donut * 100)}%` : 0}
          strokeWidth={2}
        >
          {data.map((entry) => (
            <Cell
              key={String(entry[nameKey])}
              fill={`var(--color-${entry[nameKey]})`}
            />
          ))}
        </Pie>
        {showLegend && (
          <ChartLegend
            content={<ChartLegendContent nameKey={nameKey} className="flex-wrap gap-2" />}
          />
        )}
      </RechartsPieChart>
    </ChartContainer>
  );
}
