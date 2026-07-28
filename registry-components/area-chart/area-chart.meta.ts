import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "area-chart",
  componentName: "AreaChart",
  title: "Area Chart",
  description:
    "Recharts area chart on the shadcn ChartContainer: multi-series with per-series gradient fills, optional stacking, grid, y-axis, legend, and a theme-aware tooltip. Config-driven colors via --chart tokens.",
  category: "Chart",
  dependencies: ["recharts"],
  registryDependencies: ["chart"],
  usage: `import { AreaChart } from "@/components/beste/component/area-chart";

<AreaChart
  xKey="month"
  stacked
  config={{
    revenue: { label: "Revenue", color: "var(--chart-1)" },
    orders: { label: "Orders", color: "var(--chart-2)" },
  }}
  data={[
    { month: "Jan", revenue: 4200, orders: 2400 },
    { month: "Feb", revenue: 3800, orders: 2100 },
  ]}
/>`,
};
