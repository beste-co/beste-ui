import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "filter-multiselect",
  title: "Multiselect Filter",
  description:
    "Dropdown with checkbox rows and a selection-count badge. Keeps many-option filters compact in toolbars where a checkbox list would not fit.",
  category: "Filter",
  registryDependencies: ["badge", "button", "checkbox", "label", "popover"],
  usage: `import { FilterMultiselect } from "@/components/beste/component/filter-multiselect";

<FilterMultiselect
  label="Size"
  placeholder="All sizes"
  defaultValue={["m"]}
  onChange={(value) => console.log("selected:", value)}
  options={[
    { label: "S", value: "s", count: 12 },
    { label: "M", value: "m", count: 28 },
    { label: "L", value: "l", count: 24 },
  ]}
/>`,
};
