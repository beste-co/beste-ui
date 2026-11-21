/** Playground for `ai62`. Site-only: `shadcn add` copies the .tsx and nothing else. */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "agent", label: "Agent", kind: "select", options: ["claude", "openai", "cursor", "gemini", "grok", "beste"], default: "claude" },
    { prop: "call", label: "Call", kind: "text", default: "update_section" },
    { prop: "rejectedLabel", label: "Rejected label", kind: "text", default: "Rejected" },
    { prop: "savedLabel", label: "Saved label", kind: "text", default: "Saved to draft" },
    { prop: "retryLabel", label: "Retry label", kind: "text", default: "Fix and retry" },
    {
      prop: "lineTone",
      label: "Line tone",
      kind: "segmented",
      options: [
        { value: "soft", label: "Soft" },
        { value: "strong", label: "Strong" },
        { value: "ink", label: "Ink" },
      ],
      default: "soft",
      group: "Surface",
    },
  ],
};
