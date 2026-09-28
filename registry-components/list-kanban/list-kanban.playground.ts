/**
 * Playground for `list-kanban`: the board's surface and how tall a column grows.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Drag", does: "Lift a card into a ghost and carry it within or between columns. The board and tall columns scroll near their edges." },
    { keys: "Long press (touch)", does: "Lift a card. A finger that moves first scrolls the board instead." },
    { keys: "Space / Enter", does: "Pick the focused card up, or drop it where it is." },
    { keys: "Arrow up / down", does: "Move the picked up card within its column." },
    { keys: "Arrow left / right", does: "Carry it to the neighboring column." },
    { keys: "Home / End", does: "Move it to the top or the bottom of the column." },
    { keys: "Escape", does: "Put the card back where it started. Works mid drag too." },
  ],
  controls: [
    { prop: "maxHeight", label: "Column height", kind: "select", options: ["16rem", "22rem", "28rem", "40rem"], default: "28rem", group: "Board" },
    ...SURFACE_CONTROLS,
  ],
};
