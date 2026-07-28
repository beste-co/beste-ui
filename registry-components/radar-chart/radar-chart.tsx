"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RechartsRadarChart,
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

interface RadarChartProps {
  data: Array<Record<string, string | number>>;
  /** Series config keyed by data field: { desktop: { label, color } } */
  config: ChartConfig;
  /** Field placed around the polar angle axis */
  angleKey: string;
  /** Fill opacity for each radar area (0 = outline only) */
  fillOpacity?: number;
  showLegend?: boolean;
  className?: string;
}

const radarChartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig;

export const radarChartDemo: RadarChartProps = {
  angleKey: "metric",
  config: radarChartConfig,
  fillOpacity: 0.5,
  data: [
    { metric: "Speed", desktop: 186, mobile: 120 },
    { metric: "Reliability", desktop: 305, mobile: 200 },
    { metric: "Comfort", desktop: 237, mobile: 190 },
    { metric: "Safety", desktop: 273, mobile: 230 },
    { metric: "Efficiency", desktop: 209, mobile: 160 },
    { metric: "Design", desktop: 264, mobile: 220 },
  ],
};

export function RadarChart({
  data,
  config,
  angleKey,
  fillOpacity = 0.5,
  showLegend = false,
  className,
}: RadarChartProps) {
  const series = Object.keys(config);

  return (
    <ChartContainer
      config={config}
      className={cn("mx-auto aspect-square max-h-72 w-full", className)}
    >
      <RechartsRadarChart data={data}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <PolarGrid />
        <PolarAngleAxis dataKey={angleKey} />
        {series.map((key) => (
          <Radar
            key={key}
            dataKey={key}
            stroke={`var(--color-${key})`}
            fill={`var(--color-${key})`}
            fillOpacity={fillOpacity}
            strokeWidth={2}
          />
        ))}
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
      </RechartsRadarChart>
    </ChartContainer>
  );
}
