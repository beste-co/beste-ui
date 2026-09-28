import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "readout-stat",
  title: "Readout Stat",
  description:
    "A KPI readout: a label, a big figure written with Intl.NumberFormat (number, currency, percent or compact, in any locale) whose digits roll into place like an odometer whenever the value changes, a delta chip that knows whether up is good news, an inline sparkline that draws itself in and ends on a dot in the verdict's color, and an optional caption. The written figure is read out once for screen readers; the rolling columns are decoration. Three tones and three sizes.",
  category: "Readout",
  usage: `import { ReadoutStat } from "@/components/beste/component/readout-stat";

<ReadoutStat
  label="Monthly revenue"
  value={48290}
  format="currency"          // "number" | "currency" | "percent" | "compact"
  currency="USD"
  previous={42870}           // the chip shows the change from this
  trend={[31, 34, 33, 37, 40, 43, 45, 48]}
  caption="Compared with August"
/>

// Churn going down is good news
<ReadoutStat
  label="Churn"
  value={0.021}
  format="percent"
  delta={-0.18}              // a ready-made change, as a fraction
  goodDirection="down"
  tone="outline"             // "muted" (default) | "outline" | "ghost"
  size="sm"                  // "sm" | "default" | "lg"
/>`,
};
