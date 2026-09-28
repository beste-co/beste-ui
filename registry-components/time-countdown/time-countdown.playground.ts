/**
 * Playground for `time-countdown`: how long, which units and how they read.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "duration", label: "Duration", kind: "slider", min: 10, max: 400000, step: 10, unit: "s", group: "Countdown" },
    {
      prop: "units",
      label: "Units",
      kind: "toggles",
      options: ["days", "hours", "minutes", "seconds"],
      group: "Countdown",
    },
    { prop: "hideLeadingZeros", label: "Hide leading zeros", kind: "switch", default: false, group: "Countdown" },
    { prop: "completeLabel", label: "When done", kind: "text", placeholder: "Doors are open", group: "Countdown" },
    { prop: "labels", label: "Labels", kind: "segmented", options: ["long", "short", "narrow", "none"], default: "long", group: "Reading" },
    { prop: "locale", label: "Locale", kind: "select", options: ["en-US", "de-DE", "fr-FR", "ja-JP", "tr-TR"], group: "Reading" },
    { prop: "separator", label: "Colons", kind: "switch", default: false, group: "Reading" },
    { prop: "tone", label: "Tone", kind: "select", options: ["muted", "outline", "ghost"], default: "muted", group: "Surface" },
    { prop: "size", label: "Size", kind: "select", options: ["sm", "default", "lg"], default: "default", group: "Surface" },
  ],
};
