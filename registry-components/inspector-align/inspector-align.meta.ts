import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-align",
  title: "Inspector Align",
  description:
    "Where the contents of a box sit in it: nine cells drawn in visual terms, mapped onto justify and align afterwards so the pair swapping places under a column direction is the component's problem and not the reader's. Direction, distribution and stretch sit under the pad as rows of the family, since each is a setting like any other.",
  category: "Inspector",
  registryDependencies: ["popover"],
  registryComponents: ["inspector-segmented", "inspector-select", "inspector-tabs"],
  usage: `import { InspectorAlign, alignToCss } from "@/components/beste/component/inspector-align";

<InspectorAlign label="Align" defaultValue={{ justify: "center", align: "center" }} />

<InspectorAlign
  label="Content"
  value={align}                  // { justify, align, direction, distribute }
  onValueChange={setAlign}
  onOpenChange={(open) => console.log("editor open:", open)}
  directional={false}            // drop the row/column choice for a box that is always one
  distributable                  // space-between and its neighbours, on by default
  stretchable                    // stretch across the cross axis, on by default
  tone="outline"                 // "muted" (default) | "outline" | "ghost"
  size="sm"                      // "sm" | "default" | "lg"
/>

// The CSS the value stands for, so a panel does not rebuild the mapping
<div style={alignToCss(align)}>{children}</div>`,
};
