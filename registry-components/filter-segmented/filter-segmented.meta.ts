import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "filter-segmented",
  title: "Segmented Filter",
  description:
    "Single-select segmented control built on Tabs for mutually exclusive choices like gender or condition. Clicking the active segment clears the selection.",
  category: "Filter",
  registryDependencies: ["tabs"],
  usage: `import { FilterSegmented } from "@/components/beste/component/filter-segmented";

<FilterSegmented
  label="Gender"
  defaultValue="women"
  onChange={(value) => console.log("selected:", value)} // null when cleared
  options={[
    { label: "Women", value: "women" },
    { label: "Men", value: "men" },
    { label: "Kids", value: "kids" },
  ]}
/>`,
};
