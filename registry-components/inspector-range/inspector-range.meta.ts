import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-range",
  title: "Inspector Range",
  description:
    "Settings row for a span rather than a value: two thumbs on the row itself, the band between them filling it, and both ends of the pair read out on the right. Ticks, tones and thumb states follow inspector-slider exactly, appearing on hover.",
  category: "Inspector",
  registryDependencies: ["slider"],
  usage: `import { InspectorRange } from "@/components/beste/component/inspector-range";

// Uncontrolled
<InspectorRange label="Price" min={0} max={300} step={5} defaultValue={[40, 220]} unit="$" />

// Controlled, with a separate commit for expensive work
<InspectorRange
  label="Duration"
  value={window}
  onValueChange={setWindow}                             // every thumb move
  onValueCommit={(value) => console.log("fetch", value)} // on release
  min={0}
  max={60}
  step={1}
  unit="s"
/>

<InspectorRange
  label="Opacity"
  icon={Contrast}                                 // optional leading icon
  min={0}
  max={1}
  step={0.05}
  separator="to"                                  // "–" by default
  formatValue={(value) => \`\${Math.round(value * 100)}%\`}
  minStepsBetweenThumbs={2}                       // keeps the thumbs apart
  ticks={false}                                   // true by default: they show on hover
  value={opacity}
  onValueChange={setOpacity}
  tone="outline"                                  // "muted" (default) | "outline" | "ghost"
  size="sm"                                       // "sm" | "default" | "lg"
/>`,
};
