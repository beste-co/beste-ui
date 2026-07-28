import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "filter-slider",
  title: "Range Slider Filter",
  description:
    "Two-thumb range slider with live numeric readouts and a commit callback, built for price ranges.",
  category: "Filter",
  registryDependencies: ["slider"],
  usage: `import { FilterSlider } from "@/components/beste/component/filter-slider";

<FilterSlider
  label="Price"
  min={0}
  max={300}
  step={5}
  unit="$"
  defaultValue={[25, 180]}
  onChange={(value) => console.log("dragging:", value)}
  onCommit={(value) => console.log("committed:", value)} // fetch here
/>`,
};
