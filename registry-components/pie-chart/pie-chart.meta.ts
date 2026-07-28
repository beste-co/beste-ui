import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "pie-chart",
  componentName: "PieChart",
  title: "Pie Chart",
  description:
    "Recharts pie/donut chart on the shadcn ChartContainer: per-slice colors from config, adjustable donut hole, optional legend, and a name-keyed tooltip. Config-driven colors via --chart tokens.",
  category: "Chart",
  dependencies: ["recharts"],
  registryDependencies: ["chart"],
  usage: `import { PieChart } from "@/components/beste/component/pie-chart";

<PieChart
  dataKey="value"
  nameKey="segment"
  donut={0.55}
  showLegend
  config={{
    retailers: { label: "Retailers", color: "var(--chart-1)" },
    distributors: { label: "Distributors", color: "var(--chart-2)" },
  }}
  data={[
    { segment: "retailers", value: 2884 },
    { segment: "distributors", value: 1432 },
  ]}
/>`,
};
