/**
 * Playground for `ascii-render`: the glyphs, the form and the cursor glow.
 * Site-only, like the meta: `shadcn add` copies the .tsx and nothing else.
 */
import type { PlaygroundConfig } from "@/lib/playground-types";

export const playground: PlaygroundConfig = {
  controls: [
    { prop: "inkColor", label: "Ink", kind: "color", default: "var(--foreground)", group: "Color" },
    { prop: "paperColor", label: "Paper", kind: "color", default: "var(--background)", group: "Color" },
    { prop: "accentColor", label: "Accent", kind: "color", default: "var(--primary)", group: "Color" },
    { prop: "contrast", label: "Contrast", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Color" },
    { prop: "glyphs", label: "Glyph ramp", kind: "text", placeholder: " .:-=+*#%@", group: "Glyphs" },
    { prop: "cellSize", label: "Cell size", kind: "slider", min: 8, max: 28, step: 1, default: 14, unit: "px", group: "Glyphs" },
    { prop: "scene", label: "Form", kind: "segmented", options: ["lattice", "sphere", "torus", "asterisk"], default: "lattice", group: "Form" },
    { prop: "align", label: "Placement", kind: "segmented", options: ["left", "center", "right"], default: "center", group: "Form" },
    { prop: "size", label: "Size", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Form" },
    { prop: "spin", label: "Spin", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "speed", label: "Speed", kind: "slider", min: 0, max: 3, step: 0.1, default: 1, unit: "x", group: "Motion" },
    { prop: "drift", label: "Noise", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Motion" },
    { prop: "scanLine", label: "Scan line", kind: "switch", default: true, group: "Motion" },
    { prop: "paused", label: "Paused", kind: "switch", default: false, group: "Motion" },
    { prop: "interactive", label: "Follow cursor", kind: "switch", default: true, group: "Cursor" },
    { prop: "glow", label: "Glow", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.6, group: "Cursor" },
    { prop: "glowSize", label: "Glow size", kind: "slider", min: 0, max: 1, step: 0.05, default: 0.5, group: "Cursor" },
  ],
};
