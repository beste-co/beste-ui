/**
 * Playground for `field-search`: the query, its shortcut and the recent searches.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Command K / Control K", does: "Focus the field from anywhere on the page." },
    { keys: "Enter", does: "Search at once and remember the query, or pick the highlighted recent search." },
    { keys: "Arrow down / Arrow up", does: "Move through the recent searches while the field is empty." },
    { keys: "Delete", does: "Remove the highlighted recent search." },
    { keys: "Escape", does: "Close the list, then clear the query, then leave the field." },
  ],
  controls: [
    { prop: "placeholder", label: "Placeholder", kind: "text", group: "Field" },
    { prop: "loading", label: "Loading", kind: "switch", default: false, group: "Field" },
    { prop: "debounce", label: "Debounce", kind: "slider", min: 0, max: 1000, step: 50, default: 250, unit: "ms", group: "Field" },
    { prop: "maxRecent", label: "Recent kept", kind: "stepper", min: 1, max: 10, step: 1, default: 5, group: "Field" },
    ...SURFACE_CONTROLS.map((control) => (control.prop === "tone" ? { ...control, default: "outline" } : control)),
  ],
};
