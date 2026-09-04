import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "monitoring21",
  title: "Live Latency Bars",
  description:
    "Streaming bar chart that pushes a fresh sample every few hundred milliseconds, flags spikes in amber, and keeps a rolling p95 in the corner.",
  category: "Monitoring",
};
