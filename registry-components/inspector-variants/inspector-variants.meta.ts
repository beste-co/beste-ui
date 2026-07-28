import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-variants",
  title: "Inspector Variants",
  description:
    "The choice that has to be seen to be made: a template, a layout, a chart type. Each option is a picture, normally a rendered screenshot passed as a URL, or markup for the choices no photograph would show. The row is the trigger, the grid is width-matched to it, and the captions under the pictures can be dropped for a set whose pictures say everything.",
  category: "Inspector",
  registryDependencies: ["popover"],
  usage: `import { InspectorVariants } from "@/components/beste/component/inspector-variants";

// The ordinary case: a picture of each variant, by URL
<InspectorVariants
  label="Template"
  defaultValue="gallery"
  options={[
    { value: "editorial", label: "Editorial", image: "/thumbs/editorial.png" },
    { value: "gallery", label: "Gallery", image: "/thumbs/gallery.png" },
    { value: "portfolio", label: "Portfolio", image: "/thumbs/portfolio.png", description: "Grid of work" },
  ]}
/>

<InspectorVariants
  label="Chart"
  options={charts}
  value={chart}
  onValueChange={setChart}
  onOpenChange={(open) => console.log("grid open:", open)}
  columns={2}              // choices per row, three by default
  ratio="16 / 9"           // shape of each picture, "4 / 3" by default
  fit="contain"            // "cover" (default) crops to the shape; "contain" fits the whole picture in
  captioned={false}        // pictures alone; each cell keeps the name as its label and tooltip
  placeholder="Choose one" // shown while nothing is selected
  clearable                // adds a "Remove Chart" button at the foot
  tone="outline"           // "muted" (default) | "outline" | "ghost"
  size="sm"                // "sm" | "default" | "lg"
/>

// No screenshot to point at: an abstraction, or a miniature of the real thing.
// \`image\` wins when both are given.
<InspectorVariants
  label="Density"
  options={[
    {
      value: "comfortable",
      label: "Comfortable",
      preview: (
        <span className="flex size-full flex-col justify-center gap-1.5 p-2">
          <span className="h-1 rounded-full bg-foreground/25" />
          <span className="h-1 w-2/3 rounded-full bg-foreground/25" />
        </span>
      ),
    },
    { value: "compact", label: "Compact", preview: <MyMiniature dense /> },
  ]}
/>

// A picture that fails to load is marked rather than left blank: an empty box is a
// variant with nothing in it, which is a different thing.`,
};
