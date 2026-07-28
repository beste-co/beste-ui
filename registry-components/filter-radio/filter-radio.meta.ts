import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "filter-radio",
  title: "Radio Filter",
  description:
    "Single-select radio list with optional result counts. Clicking the active option clears the selection, so the filter is always escapable.",
  category: "Filter",
  registryDependencies: ["label", "radio-group"],
  usage: `import { FilterRadio } from "@/components/beste/component/filter-radio";

<FilterRadio
  label="Fit"
  defaultValue="regular"
  onChange={(value) => console.log("selected:", value)} // null when cleared
  options={[
    { label: "Regular", value: "regular", count: 32 },
    { label: "Oversized", value: "oversized", count: 14 },
  ]}
/>`,
};
