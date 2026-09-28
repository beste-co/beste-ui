/**
 * Playground for `nav-breadcrumb`: the separator, the fold and the trail.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Tab", does: "Move through the levels in order, including the button that holds the folded ones." },
    { keys: "Enter / Space on the button", does: "Open the menu of folded levels." },
    { keys: "Up / Down in the menu", does: "Move between the folded levels; Enter follows one, Escape closes the menu." },
  ],
  controls: [
    { prop: "separator", label: "Separator", kind: "segmented", options: ["chevron", "slash"], default: "chevron", group: "Trail" },
    { prop: "homeIcon", label: "Home icon", kind: "switch", default: false, group: "Trail" },
    { prop: "maxItemWidth", label: "Max item width", kind: "slider", min: 80, max: 320, step: 10, unit: "px", default: 180, group: "Trail" },
    ...SURFACE_CONTROLS.filter((control) => control.prop !== "disabled").map((control) => (control.prop === "tone" ? { ...control, default: "ghost" } : control)),
  ],
};
