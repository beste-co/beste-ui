/**
 * Playground for `time-relative`: the wording, when it turns into a date and the surface.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "prefix", label: "Prefix", kind: "text", placeholder: "Edited" },
    { prop: "format", label: "Wording", kind: "segmented", options: ["long", "short", "narrow"], default: "long" },
    { prop: "numeric", label: "Numeric", kind: "segmented", options: ["auto", "always"], default: "auto" },
    { prop: "locale", label: "Locale", kind: "select", options: ["en-US", "en-GB", "de-DE", "fr-FR", "ja-JP"] },
    { prop: "reserveWidth", label: "Reserve width", kind: "switch", default: false },
    ...SURFACE_CONTROLS.filter((control) => control.prop !== "disabled").map((control) =>
      control.prop === "tone" ? { ...control, default: "ghost" } : control,
    ),
  ],
};
