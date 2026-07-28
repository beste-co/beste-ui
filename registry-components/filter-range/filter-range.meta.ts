import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "filter-range",
  title: "Min/Max Range Filter",
  description:
    "Paired number inputs for open-ended ranges: either side can stay empty, so users can filter by only a minimum or only a maximum.",
  category: "Filter",
  registryDependencies: ["input"],
  usage: `import { FilterRange } from "@/components/beste/component/filter-range";

<FilterRange
  label="Price"
  min={0}
  max={500}
  defaultValue={["25", ""]}   // 25 and up
  onChange={([min, max]) => console.log("range:", min, max)}
/>`,
};
