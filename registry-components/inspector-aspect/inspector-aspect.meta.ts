import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-aspect",
  title: "Inspector Aspect",
  description:
    "Settings row for a ratio: the row prints it and draws it, and opens an editor with the ratios worth a name plus both sides always editable. It is kept as two numbers rather than as their quotient, since 16:9 is what a reader recognises.",
  category: "Inspector",
  registryDependencies: ["popover"],
  registryComponents: ["inspector-select", "inspector-stepper"],
  usage: `import { InspectorAspect } from "@/components/beste/component/inspector-aspect";

// Uncontrolled
<InspectorAspect label="Aspect Ratio" defaultValue={{ w: 16, h: 9 }} />

// Controlled, with a separate commit for expensive work
<InspectorAspect
  label="Aspect Ratio"
  value={ratio}
  onValueChange={setRatio}
  onValueCommit={(value) => save(value)}
/>

<InspectorAspect
  label="Thumbnail"
  icon={RatioIcon}     // optional leading icon
  tone="outline"       // "muted" (default) | "outline" | "ghost"
  size="sm"            // "sm" | "default" | "lg"
  maxSide={64}         // largest either side may be
  presets={[           // shortcuts, not the set of allowed answers
    { w: 1, h: 1, label: "Square" },
    { w: 4, h: 5, label: "Feed" },
  ]}
  value={ratio}
  onValueChange={setRatio}
/>

// What the value turns into
<div style={{ aspectRatio: \`\${ratio.w} / \${ratio.h}\` }} />

// Sides are reduced by their common factor for display, so a value of 1920 by 1080
// still reads as 16:9. A ratio nobody named is still a ratio, so the menu
// simply sits on "Custom".`,
};
