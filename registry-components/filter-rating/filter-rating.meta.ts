import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "filter-rating",
  title: "Rating Filter",
  description:
    "Star rows for minimum-rating filtering in the familiar n-and-up pattern. Clicking the active row clears the selection.",
  category: "Filter",
  usage: `import { FilterRating } from "@/components/beste/component/filter-rating";

<FilterRating
  label="Rating"
  defaultValue="4"
  onChange={(value) => console.log("minimum rating:", value)} // null when cleared
  options={[
    { label: "4 & up", value: "4" },
    { label: "3 & up", value: "3" },
  ]}
/>`,
};
