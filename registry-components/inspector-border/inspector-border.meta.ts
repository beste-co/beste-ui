import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-border",
  title: "Inspector Border",
  description:
    "Settings row for a border: the row draws one exactly as described beside a summary of it, and opens an editor with the sides as icon toggles and the width, style and colour under them, each one a row of the family.",
  category: "Inspector",
  registryDependencies: ["popover"],
  registryComponents: [
    "inspector-toggles",
    "inspector-segmented",
    "inspector-stepper",
    "inspector-color",
  ],
  usage: `import { InspectorBorder } from "@/components/beste/component/inspector-border";

// Uncontrolled. Opens on all four sides, 1px, dashed.
<InspectorBorder label="Border" />

// An empty \`sides\` list is no border, so the width never has to carry a zero to
// mean the same thing.
<InspectorBorder label="Border" defaultValue={{ sides: ["bottom"], width: 2, style: "solid" }} />

// Controlled, with a separate commit for expensive work
<InspectorBorder
  label="Card border"
  value={border}
  onValueChange={setBorder}
  onValueCommit={(value) => save(value)}
/>

<InspectorBorder
  label="Divider"
  icon={SquareIcon}      // optional leading icon
  tone="outline"         // "muted" (default) | "outline" | "ghost"
  size="sm"              // "sm" | "default" | "lg"
  maxWidth={8}           // widest the border may be, in px
  styles={["solid"]}     // one entry fixes the style and drops the choice
  alpha                  // carry an alpha channel through the colour
  format="oklch"         // notation the colour is written back in
  value={border}
  onValueChange={setBorder}
/>

// What the value turns into. Per side rather than one \`border\`, since the whole
// point of the row is that the four sides differ.
const side = (name) =>
  border.sides?.includes(name) ? \`\${border.width}px \${border.style} \${border.color}\` : undefined;

<div
  style={{
    borderTop: side("top"),
    borderRight: side("right"),
    borderBottom: side("bottom"),
    borderLeft: side("left"),
  }}
/>`,
};
