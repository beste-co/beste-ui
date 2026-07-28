import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "filter-swatch",
  title: "Color Swatch Filter",
  description:
    "Multi-select color circles for color filtering. Each option paints its own CSS color and stays accessible via screen-reader labels.",
  category: "Filter",
  usage: `import { FilterSwatch } from "@/components/beste/component/filter-swatch";

<FilterSwatch
  label="Color"
  defaultValue={["black"]}
  onChange={(value) => console.log("selected:", value)}
  options={[
    { label: "Black", value: "black", swatch: "#18181b" },
    { label: "Blue", value: "blue", swatch: "#2563eb" },
  ]}
/>`,
};
