import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "radial-chart",
  componentName: "RadialChart",
  title: "Radial Chart",
  description:
    "Recharts radial gauge on the shadcn ChartContainer: a single value plotted as a proportional ring with a muted track and a centered percentage plus caption. Ideal for progress, targets, and completion rates.",
  category: "Chart",
  dependencies: ["recharts"],
  registryDependencies: ["chart"],
  usage: `import { RadialChart } from "@/components/beste/component/radial-chart";

<RadialChart
  value={68}
  max={100}
  label="On track for 80% target"
  color="var(--chart-1)"
/>`,
};
