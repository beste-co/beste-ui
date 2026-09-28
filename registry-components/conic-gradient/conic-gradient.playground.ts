/**
 * Playground for `conic-gradient`: the colors, the shape of the glow and how it turns.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "colors.0", label: "Color 1", kind: "color", group: "Colors" },
    { prop: "colors.1", label: "Color 2", kind: "color", group: "Colors" },
    { prop: "colors.2", label: "Color 3", kind: "color", group: "Colors" },
    { prop: "colors.3", label: "Color 4", kind: "color", group: "Colors" },
    { prop: "colors.4", label: "Color 5", kind: "color", group: "Colors" },
    { prop: "colors.5", label: "Color 6", kind: "color", group: "Colors" },
    { prop: "backgroundColor", label: "Background", kind: "color", default: "#07060d", group: "Colors" },
    { prop: "saturation", label: "Saturation", kind: "slider", min: 0, max: 2, step: 0.05, default: 1, group: "Colors" },
    { prop: "radius", label: "Radius", kind: "slider", min: 0.1, max: 2, step: 0.05, default: 0.75, group: "Shape" },
    { prop: "ring", label: "Ring", kind: "slider", min: 0, max: 1, step: 0.05, default: 0, group: "Shape" },
    { prop: "falloff", label: "Falloff", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Shape" },
    { prop: "repeat", label: "Arms", kind: "stepper", min: 1, max: 6, step: 1, default: 1, group: "Shape" },
    { prop: "twist", label: "Twist", kind: "slider", min: -1, max: 1, step: 0.05, default: 0.2, group: "Shape" },
    { prop: "blur", label: "Blur", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Shape" },
    { prop: "core", label: "Core light", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.3, group: "Shape" },
    { prop: "centerX", label: "Center X", kind: "slider", min: 0, max: 1, step: 0.01, default: 0.5, group: "Position" },
    { prop: "centerY", label: "Center Y", kind: "slider", min: 0, max: 1, step: 0.01, default: 0.5, group: "Position" },
    { prop: "angle", label: "Angle", kind: "slider", min: 0, max: 360, step: 5, default: 0, unit: "°", group: "Position" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.2, group: "Grain" },
    { prop: "grainSize", label: "Grain size", kind: "slider", min: 1, max: 4, step: 0.25, default: 1, unit: "px", group: "Grain" },
    { prop: "grainMotion", label: "Flicker", kind: "switch", default: true, group: "Grain" },
    { prop: "rotation", label: "Rotation", kind: "slider", min: -3, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "breathe", label: "Breathe", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.4, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
  ],
};
