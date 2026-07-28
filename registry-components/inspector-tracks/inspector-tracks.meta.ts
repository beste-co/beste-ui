import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-tracks",
  title: "Inspector Tracks",
  description:
    "The columns of a grid as a list of lengths: the row shows the CSS it comes to, the editor holds one length per line with a picture of the shares above them. There is no reordering on purpose, because a track's place in the list is its place in the grid.",
  category: "Inspector",
  registryDependencies: ["popover", "select"],
  usage: `import { InspectorTracks, tracksToCss } from "@/components/beste/component/inspector-tracks";

<InspectorTracks
  label="Columns"
  defaultValue={[
    { size: 1, unit: "fr" },
    { size: 2, unit: "fr" },
    { size: 240, unit: "px" },
  ]}
/>

<InspectorTracks
  label="Rows"
  value={rows}
  onValueChange={setRows}
  onOpenChange={(open) => console.log("editor open:", open)}
  units={["fr", "px", "auto"]}   // ["fr", "px", "%", "auto"] by default
  minTracks={2}
  maxTracks={6}
  tone="outline"                 // "muted" (default) | "outline" | "ghost"
  size="sm"                      // "sm" | "default" | "lg"
/>

// The value is only useful once it is a template, so the join ships with it
<div style={{ display: "grid", gridTemplateColumns: tracksToCss(columns) }}>{children}</div>`,
};
