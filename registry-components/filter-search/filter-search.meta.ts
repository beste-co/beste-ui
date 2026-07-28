import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "filter-search",
  title: "Search Filter",
  description:
    "Text search input with a leading icon for keyword filtering. Debounce in the consumer if you fetch on change.",
  category: "Filter",
  registryDependencies: ["input"],
  usage: `import { FilterSearch } from "@/components/beste/component/filter-search";

<FilterSearch
  label="Search"
  placeholder="Search products"
  onChange={(value) => console.log("query:", value)}
/>`,
};
