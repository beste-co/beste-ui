import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "filter-combobox",
  title: "Combobox Filter",
  description:
    "Searchable dropdown for very long option lists like brands. Type to narrow options, select one or many, and see result counts inline.",
  category: "Filter",
  registryDependencies: ["button", "command", "popover"],
  usage: `import { FilterCombobox } from "@/components/beste/component/filter-combobox";

<FilterCombobox
  label="Brand"
  placeholder="All brands"
  searchPlaceholder="Search brands"
  multiple                       // omit for single-select
  onChange={(value) => console.log("selected:", value)}
  options={[
    { label: "Acme Supply", value: "acme", count: 18 },
    { label: "Northwind", value: "northwind", count: 12 },
  ]}
/>`,
};
