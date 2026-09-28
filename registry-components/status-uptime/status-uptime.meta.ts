import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "status-uptime",
  title: "Status Uptime",
  description:
    "Service row for status pages and dashboards: a status dot that pulses softly while something is wrong, the service name, its current status and the uptime over the days on screen, above a strip of daily bars colored by each day's worst status. Hovering or focusing a bar shows the date, that day's uptime and its incidents; the strip is one tab stop with arrow keys between days, and narrow rows drop their oldest days instead of squeezing the bars.",
  category: "Status",
  usage: `import { StatusUptime } from "@/components/beste/component/status-uptime";

<StatusUptime
  name="Public API"
  days={[
    { date: "2026-09-25", status: "operational" },
    { date: "2026-09-26", status: "degraded", uptime: 99.82, incidents: [{ title: "Elevated latency" }] },
    { date: "2026-09-27", status: "operational" },
  ]}
  range={90}             // most days shown; narrow rows show fewer
/>

// The current status defaults to the last day; set it to override
<StatusUptime
  name="Webhooks"
  status="partial"       // "operational" | "maintenance" | "degraded" | "partial" | "major"
  days={history}
  showPercent={false}
  tone="outline"         // "muted" (default) | "outline" | "ghost"
  size="sm"              // "sm" | "default" | "lg"
/>

// Siblings share the same words and colors
import { statusMeta } from "@/components/beste/component/status-uptime";
console.log(statusMeta.degraded.label);`,
};
