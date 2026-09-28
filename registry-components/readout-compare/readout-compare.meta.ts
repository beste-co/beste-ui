import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "readout-compare",
  title: "Readout Compare",
  description:
    "One metric across two periods: the label and a delta chip that knows whether up is good news, the current figure written with Intl.NumberFormat beside the one it is compared with, and a pair of bars on one scale, this period solid and the earlier one faint, that grow in from the left on a soft ease-out. Optional breakdown rows compare further metrics the same way, each with its own twin bars and chip, and each row can have its own format and direction. The comparison is read out once as a sentence for screen readers. Three tones and three sizes; it shares its number formatting with readout-stat.",
  category: "Readout",
  registryComponents: ["readout-stat"],
  usage: `import { ReadoutCompare } from "@/components/beste/component/readout-compare";

<ReadoutCompare
  label="Streams"
  value={1284300}
  previous={1146900}
  format="compact"            // "number" | "currency" | "percent" | "compact"
  currentLabel="Sep 2026"
  previousLabel="Aug 2026"
  breakdown={[
    { label: "Spotify", value: 742100, previous: 681400 },
    { label: "Apple Music", value: 298200, previous: 301900 },
  ]}
/>

// Refunds going down is good news
<ReadoutCompare
  label="Refunds"
  value={1840}
  previous={2310}
  format="currency"
  goodDirection="down"
  tone="outline"              // "muted" (default) | "outline" | "ghost"
  size="sm"                   // "sm" | "default" | "lg"
/>`,
};
