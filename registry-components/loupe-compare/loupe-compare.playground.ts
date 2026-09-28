/**
 * Playground for `loupe-compare`: the divider's direction and how it moves.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import { SURFACE_CONTROLS, type PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  keys: [
    { keys: "Drag", does: "Move the divider; it follows the pointer exactly." },
    { keys: "Click", does: "Send the divider to that spot on a spring." },
    { keys: "Hover mode", does: "A mouse moves the divider without pressing." },
    { keys: "Arrow keys", does: "Move it by 1%. On a vertical divider, up moves it up." },
    { keys: "Page Up / Page Down", does: "Move it by 10%." },
    { keys: "Home / End", does: "Send it to either edge." },
  ],
  controls: [
    { prop: "orientation", label: "Orientation", kind: "segmented", options: ["horizontal", "vertical"], default: "horizontal", group: "Divider" },
    { prop: "mode", label: "Mode", kind: "segmented", options: ["drag", "hover"], default: "drag", group: "Divider" },
    { prop: "aspectRatio", label: "Aspect ratio", kind: "select", options: ["1/1", "4/3", "3/2", "16/9"], default: "3/2", group: "Frame" },
    ...SURFACE_CONTROLS,
  ],
};
