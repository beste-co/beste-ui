import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-scrub",
  title: "Inspector Scrub",
  description:
    "A number with no ends, dragged from the row itself: for the values that have no maximum worth naming, like a z-index, an X offset or a letter-spacing. The drag is relative rather than positional, so pressing anywhere is safe, and a soft range gives the bar something to draw against that the value is free to leave. Only the reported number is quantized, so the pointer never fights the grid.",
  category: "Inspector",
  usage: `import { InspectorScrub } from "@/components/beste/component/inspector-scrub";

// Both bounds optional, which is the point: neither of these has an honest maximum
<InspectorScrub label="Letter spacing" defaultValue={0} step={0.01} suffix="em" sensitivity={8} />

// The bar, for a number that has no ends. \`softMin\`/\`softMax\` are the span worth
// working in, not a limit: the fill shows where the value sits in that span, pins
// once it is past it, and the number carries on. With no span there is no bar,
// since a bar over an unknown range would have to invent one.
<InspectorScrub label="Letter spacing" softMin={-0.1} softMax={0.4} step={0.01} suffix="em" />

<InspectorScrub
  label="X offset"
  value={x}
  onValueChange={setX}                       // every step of the drag
  onValueCommit={(next) => console.log("settled on", next)}  // when the drag ends
  step={1}
  precision={0}
  sensitivity={4}      // pixels of drag per step; lower is faster
  suffix="px"
  name="x-offset"
  tone="outline"       // "muted" (default) | "outline" | "ghost"
  size="sm"            // "sm" | "default" | "lg"
/>

// Bounded on one side only, which no slider can express
<InspectorScrub label="Z index" min={0} step={1} precision={0} />`,
};
