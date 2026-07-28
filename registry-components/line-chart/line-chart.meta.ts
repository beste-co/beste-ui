import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "line-chart",
  componentName: "LineChart",
  title: "Line Chart",
  description:
    "Recharts line chart on the shadcn ChartContainer: multi-series lines with configurable curve, optional dots, active-dot hover, grid, y-axis, legend, and a theme-aware tooltip. Config-driven colors via --chart tokens.",
  category: "Chart",
  dependencies: ["recharts"],
  registryDependencies: ["chart"],
  usage: `import { LineChart } from "@/components/beste/component/line-chart";

<LineChart
  xKey="day"
  config={{
    thisMonth: { label: "This month", color: "var(--chart-1)" },
    lastMonth: { label: "Last month", color: "var(--chart-2)" },
  }}
  data={[
    { day: "1 Jan", thisMonth: 5200, lastMonth: 4300 },
    { day: "8 Jan", thisMonth: 6100, lastMonth: 5200 },
  ]}
/>`,
};
