import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-meter",
  title: "Inspector Meter",
  description:
    "The row that reports rather than asks: a measurement the work produced, shown in the family's surface so it can sit among the settings that caused it. Threshold bands colour the bar and the number without the caller recomputing them, and it is a meter rather than a progress bar, which is how it is announced.",
  category: "Inspector",
  usage: `import { InspectorMeter } from "@/components/beste/component/inspector-meter";

// Bands read lowest first; the last one the value has reached wins
<InspectorMeter
  label="Contrast"
  value={ratio}
  min={1}
  max={21}
  precision={2}
  suffix=":1"
  thresholds={[
    { from: 1, status: "danger" },
    { from: 3, status: "warning" },
    { from: 4.5, status: "success" },
  ]}
/>

<InspectorMeter
  label="Bundle"
  value={bytes}
  max={250_000}
  format={(n) => \`\${Math.round(n / 1000)} kB\`}   // decides the whole reading
  status="warning"                                  // overrides the bands outright
  tone="outline"                                    // "muted" (default) | "outline" | "ghost"
  size="sm"                                         // "sm" | "default" | "lg"
/>

// A reading with no meaningful range is better off as a number alone
<InspectorMeter label="Products" value={1533} showBar={false} />`,
};
