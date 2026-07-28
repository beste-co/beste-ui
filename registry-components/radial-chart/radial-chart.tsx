"use client";

import {
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  type ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface RadialChartProps {
  /** The value to plot */
  value: number;
  /** Full-scale value (default 100) */
  max?: number;
  /** Muted caption under the big number */
  label?: string;
  /** Big centered text; defaults to the rounded percentage of max */
  valueLabel?: string;
  /** Ring color token */
  color?: string;
  className?: string;
}

export const radialChartDemo: RadialChartProps = {
  value: 68,
  max: 100,
  label: "On track for 80% target",
  color: "var(--chart-1)",
};

export function RadialChart({
  value,
  max = 100,
  label,
  valueLabel,
  color = "var(--chart-1)",
  className,
}: RadialChartProps) {
  const config = {
    value: { label: label ?? "Value", color },
  } satisfies ChartConfig;
  const data = [{ metric: "value", value, fill: "var(--color-value)" }];
  const centerText = valueLabel ?? `${Math.round((value / max) * 100)}%`;

  return (
    <ChartContainer
      config={config}
      className={cn("mx-auto aspect-square max-h-72 w-full", className)}
    >
      <RadialBarChart
        data={data}
        startAngle={90}
        endAngle={-270}
        innerRadius="62%"
        outerRadius="92%"
      >
        <PolarAngleAxis type="number" domain={[0, max]} tick={false} />
        <RadialBar
          dataKey="value"
          background
          cornerRadius={20}
          className="stroke-transparent"
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                const cx = viewBox.cx ?? 0;
                const cy = viewBox.cy ?? 0;
                return (
                  // dominantBaseline centers each tspan on its own y, so the
                  // number stays vertically centered whether or not a caption
                  // is rendered below it.
                  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
                    <tspan
                      x={cx}
                      y={label ? cy - 12 : cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {centerText}
                    </tspan>
                    {label && (
                      <tspan
                        x={cx}
                        y={cy + 16}
                        className="fill-muted-foreground text-sm"
                      >
                        {label}
                      </tspan>
                    )}
                  </text>
                );
              }
              return null;
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
