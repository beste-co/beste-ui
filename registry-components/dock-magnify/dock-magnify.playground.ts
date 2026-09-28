/**
 * Playground for `dock-magnify`: how far and how much the tiles swell, and where the dock sits.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Move the pointer along the dock", does: "Tiles swell with their distance from the pointer and make room for each other." },
    { keys: "Tab", does: "Enter the dock. It is one stop, landing on the tile used last, which swells as if hovered." },
    { keys: "Arrow keys", does: "Move along the dock: left and right on a horizontal dock, up and down on a vertical one." },
    { keys: "Home / End", does: "Jump to the first or the last tile." },
    { keys: "Enter / Space", does: "Open the item. The tile hops when bounce is on." },
  ],
  controls: [
    { prop: "magnification", label: "Magnification", kind: "slider", min: 1, max: 3, step: 0.05, default: 1.8, unit: "x", group: "Swell" },
    { prop: "distance", label: "Distance", kind: "slider", min: 60, max: 300, step: 10, default: 140, unit: "px", group: "Swell" },
    { prop: "side", label: "Side", kind: "select", options: ["bottom", "top", "left", "right"], default: "bottom", group: "Dock" },
    { prop: "bounceOnClick", label: "Bounce on click", kind: "switch", default: true, group: "Dock" },
    ...SURFACE_CONTROLS.filter((control) => control.prop !== "disabled"),
  ],
};
