import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "filter-chips",
  title: "Chips Filter",
  description:
    "Multi-select button chips for compact option sets like sizes. Works controlled or uncontrolled.",
  category: "Filter",
  usage: `import { FilterChips } from "@/components/beste/component/filter-chips";

<FilterChips
  label="Size"
  defaultValue={["m"]}
  onChange={(value) => console.log("selected:", value)}
  options={[
    { label: "S", value: "s" },
    { label: "M", value: "m" },
    { label: "L", value: "l" },
  ]}
/>`,
};
