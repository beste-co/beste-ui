import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "filter-select",
  title: "Select Filter",
  description:
    "Single-select dropdown for long option lists that would crowd a sidebar. Supports a clear item, result counts, and a disabled state for dependent filters.",
  category: "Filter",
  registryDependencies: ["select"],
  usage: `import { FilterSelect } from "@/components/beste/component/filter-select";

<FilterSelect
  label="Category"
  placeholder="All categories"
  clearLabel="All categories"   // first item that clears the selection
  onChange={(value) => console.log("selected:", value)} // null when cleared
  options={[
    { label: "Sneakers", value: "sneakers", count: 24 },
    { label: "T-Shirts", value: "t-shirts", count: 18 },
  ]}
/>`,
};
