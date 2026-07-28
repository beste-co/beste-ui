import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-spacing",
  title: "Inspector Spacing",
  description:
    "Settings row for the four edges of a box: the row carries a CSS-shorthand summary, and opens a cross where each field sits on the edge it sets, tied together or not.",
  category: "Inspector",
  usage: `import { InspectorSpacing } from "@/components/beste/component/inspector-spacing";

// Uncontrolled. The row reads "16 24 px"; the cross opens on click, and the link
// toggle in its middle starts on when all four edges already match.
<InspectorSpacing label="Padding" defaultValue={{ top: 16, right: 24, bottom: 16, left: 24 }} suffix="px" />

// Controlled, with a separate commit for expensive work
<InspectorSpacing
  label="Margin"
  value={margin}
  onValueChange={setMargin}                             // every accepted keystroke
  onValueCommit={(value) => console.log("persist", value)} // Enter or blur
  min={0}
  max={128}
  step={4}
  suffix="px"
/>

<InspectorSpacing
  label="Inset"
  icon={Frame}           // optional leading icon
  linked={linked}        // take the link state over, if it belongs to your state
  onLinkedChange={setLinked}
  onOpenChange={(open) => console.log("editor open:", open)}
  value={inset}
  onValueChange={setInset}
  tone="outline"         // "muted" (default) | "outline" | "ghost"
  size="sm"              // "sm" | "default" | "lg"
/>

// Always four edges, no tie-together toggle
<InspectorSpacing label="Border width" hideLink max={12} value={border} onValueChange={setBorder} />`,
};
