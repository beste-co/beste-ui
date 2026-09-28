/**
 * Playground for `list-sortable`: how a drag starts, and the rows.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Drag", does: "Lift a row and move it. The other rows make room, and the list scrolls near its edges." },
    { keys: "Long press (touch)", does: "Lift a row. A finger that moves first scrolls the list instead." },
    { keys: "Space / Enter", does: "Pick the focused row up, or drop it where it is." },
    { keys: "Arrow keys", does: "Carry the picked up row one place up or down." },
    { keys: "Home / End", does: "Carry it to the top or the bottom." },
    { keys: "Escape", does: "Put the row back where it started. Works mid drag too." },
  ],
  controls: [
    { prop: "handle", label: "Grip only", kind: "switch", default: false, group: "Drag" },
    { prop: "grip", label: "Show grip", kind: "switch", default: true, group: "Drag" },
    ...SURFACE_CONTROLS.map((control) => (control.prop === "tone" ? { ...control, default: "outline" } : control)),
  ],
};
