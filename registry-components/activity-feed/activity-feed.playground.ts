/**
 * Playground for `activity-feed`: the surface, the density and the locale the times are written in.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Tab", does: "Move through the Show details buttons and Load more, in reading order." },
    { keys: "Enter / Space on Show details", does: "Open or close the event's details." },
  ],
  controls: [
    { prop: "locale", label: "Locale", kind: "select", options: ["en-US", "en-GB", "de-DE", "fr-FR", "ja-JP"], default: "en-US", group: "Text" },
    { prop: "hasMore", label: "Load more", kind: "switch", default: false, group: "Text" },
    ...SURFACE_CONTROLS.filter((control) => control.prop !== "disabled").map((control) => (control.prop === "tone" ? { ...control, default: "ghost" } : control)),
  ],
};
