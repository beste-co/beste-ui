/**
 * Playground for `vortex-gradient`: the palette, the spiral and its center.
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
    { prop: "baseColor", label: "Base", kind: "color", default: "#f4eff3", group: "Colors" },
    { prop: "saturation", label: "Saturation", kind: "slider", min: 0, max: 2, step: 0.05, default: 1, group: "Colors" },
    { prop: "arms", label: "Arms", kind: "stepper", min: 1, max: 8, step: 1, default: 3, group: "Spiral" },
    { prop: "tightness", label: "Tightness", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.55, group: "Spiral" },
    { prop: "spread", label: "Spread", kind: "slider", min: 0.3, max: 2, step: 0.05, default: 1, unit: "x", group: "Spiral" },
    { prop: "turbulence", label: "Turbulence", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.4, group: "Spiral" },
    { prop: "seed", label: "Seed", kind: "stepper", min: 0, max: 20, step: 1, default: 2, group: "Spiral" },
    { prop: "depth", label: "Depth", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.35, group: "Center" },
    { prop: "eye", label: "Eye", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.35, group: "Center" },
    { prop: "centerX", label: "Center X", kind: "slider", min: 0, max: 1, step: 0.01, default: 0.5, group: "Center" },
    { prop: "centerY", label: "Center Y", kind: "slider", min: 0, max: 1, step: 0.01, default: 0.5, group: "Center" },
    { prop: "grain", label: "Grain", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.2, group: "Grain" },
    { prop: "grainSize", label: "Grain size", kind: "slider", min: 1, max: 4, step: 0.25, default: 1, unit: "px", group: "Grain" },
    { prop: "grainMotion", label: "Flicker", kind: "switch", default: true, group: "Grain" },
    {
      prop: "direction",
      label: "Direction",
      kind: "segmented",
      options: [
        { value: "clockwise", label: "Clockwise" },
        { value: "counterclockwise", label: "Counter" },
      ],
      default: "clockwise",
      group: "Motion",
    },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
  ],
};
