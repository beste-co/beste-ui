import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-corners",
  title: "Inspector Corners",
  description:
    "Settings row for the four corners of a box: the row carries a border-radius shorthand summary and a glyph rounded to match, and opens a square where each field sits on the corner it rounds.",
  category: "Inspector",
  usage: `import { InspectorCorners } from "@/components/beste/component/inspector-corners";

// Uncontrolled. The row reads "12 12 4 4 px"; the link toggle in the middle of the
// square starts on when all four corners already match.
<InspectorCorners label="Radius" defaultValue={{ topLeft: 12, topRight: 12, bottomRight: 4, bottomLeft: 4 }} suffix="px" />

// Controlled, with a separate commit for expensive work
<InspectorCorners
  label="Radius"
  value={radius}
  onValueChange={setRadius}                             // every accepted keystroke
  onValueCommit={(value) => console.log("persist", value)} // Enter or blur
  max={48}
  step={2}
  suffix="px"
/>

<InspectorCorners
  label="Corners"
  icon={Squircle}        // optional leading icon
  linked={linked}        // take the link state over, if it belongs to your state
  onLinkedChange={setLinked}
  onOpenChange={(open) => console.log("editor open:", open)}
  tone="outline"         // "muted" (default) | "outline" | "ghost"
  size="sm"              // "sm" | "default" | "lg"
  value={radius}
  onValueChange={setRadius}
/>

// Always four corners, no tie-together toggle
<InspectorCorners label="Radius" hideLink value={radius} onValueChange={setRadius} />`,
};
