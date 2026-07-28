import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "radar-chart",
  componentName: "RadarChart",
  title: "Radar Chart",
  description:
    "Recharts radar chart on the shadcn ChartContainer: multi-series polar areas with a polar grid, angle axis, adjustable fill opacity, optional legend, and a theme-aware tooltip. Config-driven colors via --chart tokens.",
  category: "Chart",
  dependencies: ["recharts"],
  registryDependencies: ["chart"],
  usage: `import { RadarChart } from "@/components/beste/component/radar-chart";

<RadarChart
  angleKey="metric"
  config={{
    desktop: { label: "Desktop", color: "var(--chart-1)" },
    mobile: { label: "Mobile", color: "var(--chart-2)" },
  }}
  data={[
    { metric: "Speed", desktop: 186, mobile: 120 },
    { metric: "Comfort", desktop: 237, mobile: 190 },
  ]}
/>`,
};
