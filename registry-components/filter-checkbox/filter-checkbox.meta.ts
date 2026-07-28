import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "filter-checkbox",
  title: "Checkbox Filter",
  description:
    "Multi-select checkbox list with optional result counts. Works controlled or uncontrolled, designed for filter sidebars and toolbars.",
  category: "Filter",
  registryDependencies: ["checkbox", "label"],
  usage: `import { FilterCheckbox } from "@/components/beste/component/filter-checkbox";

<FilterCheckbox
  label="Category"
  defaultValue={["sneakers"]}          // uncontrolled initial selection
  onChange={(value) => console.log("selected:", value)}
  options={[
    { label: "Sneakers", value: "sneakers", count: 24 },
    { label: "T-Shirts", value: "t-shirts", count: 18 },
  ]}
/>

// Controlled: pass \`value\` and keep it in your own state
<FilterCheckbox
  options={[{ label: "Sneakers", value: "sneakers" }]}
  value={["sneakers"]}
  onChange={(value) => console.log("selected:", value)}
/>`,
};
