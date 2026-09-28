/**
 * Playground for `candle-flame`: the flame, the candle and the cursor's breath.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "flameColor", label: "Flame", kind: "color", default: "#ff9a3c", group: "Color" },
    { prop: "coreColor", label: "Core", kind: "color", default: "#fff3d6", group: "Color" },
    { prop: "glowColor", label: "Glow", kind: "color", default: "#ff8a2a", group: "Color" },
    { prop: "groundColor", label: "Room", kind: "color", default: "#120d0a", group: "Color" },
    { prop: "candle", label: "Candle", kind: "switch", default: true, group: "Candle" },
    { prop: "waxColor", label: "Wax", kind: "color", default: "#efe3cf", group: "Candle" },
    { prop: "position", label: "Position", kind: "slider", min: 0, max: 1, step: 0.01, default: 0.5, group: "Candle" },
    { prop: "size", label: "Size", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Candle" },
    { prop: "flicker", label: "Flicker", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Flame" },
    { prop: "sway", label: "Sway", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Flame" },
    { prop: "glow", label: "Glow", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Flame" },
    { prop: "smoke", label: "Smoke", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Flame" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "breath", label: "Breath", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Cursor" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Cursor" },
  ],
};
