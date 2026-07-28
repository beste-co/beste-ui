import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "filter-tree",
  title: "Tree Filter",
  description:
    "Hierarchical checkbox tree for nested categories with expand/collapse rows. Checking a parent checks its whole subtree, and partially selected parents turn indeterminate.",
  category: "Filter",
  registryDependencies: ["checkbox", "label"],
  usage: `import { FilterTree } from "@/components/beste/component/filter-tree";

const categories = [
  {
    label: "Shoes",
    value: "shoes",
    children: [
      { label: "Sneakers", value: "sneakers", count: 24 },
      { label: "Boots", value: "boots", count: 10 },
    ],
  },
  { label: "Accessories", value: "accessories", count: 12 },
];

<FilterTree
  label="Category"
  options={categories}
  defaultValue={["shoes"]} // expands to shoes + sneakers + boots
  onChange={(value) => console.log("selected:", value)} // includes descendants
/>`,
};
