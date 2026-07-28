import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "bar-chart",
  componentName: "BarChart",
  title: "Bar Chart",
  description:
    "Recharts bar chart on the shadcn ChartContainer: grouped or stacked multi-series bars with rounded corners, optional grid, y-axis, legend, and a dashed-indicator tooltip. Config-driven colors via --chart tokens.",
  category: "Chart",
  dependencies: ["recharts"],
  registryDependencies: ["chart"],
  usage: `import { BarChart } from "@/components/beste/component/bar-chart";

<BarChart
  xKey="month"
  config={{
    desktop: { label: "Desktop", color: "var(--chart-1)" },
    mobile: { label: "Mobile", color: "var(--chart-2)" },
  }}
  data={[
    { month: "Jan", desktop: 186, mobile: 80 },
    { month: "Feb", desktop: 305, mobile: 200 },
  ]}
/>`,
};
