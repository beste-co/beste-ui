import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "meter-ring",
  title: "Meter Ring",
  description:
    "A circular meter for quotas, usage and progress: an SVG ring with rounded caps that fills from empty and eases to each new reading, whole or split into segments with gaps, in the foreground color, or colored by any thresholds you pass (e.g. warning past 80%, danger past 95%), with the value and unit in the middle or your own content. An indeterminate mode turns an arc round the track for work of unknown length. It is a real meter (or progressbar while indeterminate) with its value spelled out for screen readers. Three track tones and three sizes.",
  category: "Meter",
  usage: `import { MeterRing } from "@/components/beste/component/meter-ring";

<MeterRing value={84} label="Storage used" unit="GB" />

// Twelve segments, custom thresholds, a bigger ring
<MeterRing
  value={9}
  max={12}
  label="Tracks mastered"
  segments={12}
  gap={2.5}                 // percent of the ring between segments
  thresholds={[{ from: 12, status: "success" }]}
  size="lg"                 // "sm" | "default" | "lg"
  tone="outline"            // "muted" (default) | "outline" | "ghost"
/>

// Work of unknown length
<MeterRing indeterminate label="Uploading stems" />`,
};
