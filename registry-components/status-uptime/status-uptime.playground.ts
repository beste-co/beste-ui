/**
 * Playground for `status-uptime`: the service, its current status and the strip's length.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "name", label: "Name", kind: "text", placeholder: "Public API" },
    {
      prop: "status",
      label: "Status",
      kind: "select",
      options: ["operational", "maintenance", "degraded", "partial", "major"],
      default: "operational",
    },
    { prop: "range", label: "Days", kind: "stepper", min: 7, max: 90, step: 1, default: 90 },
    { prop: "showPercent", label: "Percent", kind: "switch", default: true },
    { prop: "tone", label: "Tone", kind: "select", options: ["muted", "outline", "ghost"], default: "muted", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
  ],
};
