import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "filter-toggle",
  title: "Toggle Filter",
  description:
    "Switch rows for boolean product flags like on-sale or in-stock. Multi-select, works controlled or uncontrolled.",
  category: "Filter",
  registryDependencies: ["label", "switch"],
  usage: `import { FilterToggle } from "@/components/beste/component/filter-toggle";

<FilterToggle
  label="Deals"
  defaultValue={["sale"]}
  onChange={(value) => console.log("enabled:", value)}
  options={[
    { label: "On sale", value: "sale" },
    { label: "New arrivals", value: "new" },
  ]}
/>`,
};
