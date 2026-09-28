import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "ascii-render",
  title: "ASCII Render",
  description:
    "A live WebGL scene drawn entirely in characters: a turning form is raymarched into a small grid, one cell per glyph, then printed from a monospace glyph ramp over drifting noise and a slow scan line, with cells lighting up in the accent color around the cursor. Colors, glyph ramp, cell size, form, placement, size, spin, speed, drift, scan line, contrast and the cursor glow are all props. Colors follow the theme, cells grow on slower devices, it pauses offscreen, holds a still frame for reduced motion and falls back to a dot field without WebGL.",
  category: "Media",
  isAnimated: true,
  fullBleed: true,
  dependencies: [],
  usage: `import { AsciiRender } from "@/components/beste/component/ascii-render";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <AsciiRender className="absolute inset-0" align="right" />
  <div className="relative">...</div>
</section>

<AsciiRender
  className="min-h-[32rem]"
  inkColor="var(--foreground)"  // any CSS color, tokens included
  accentColor="var(--primary)"
  glyphs=" .,:;ox%#@"           // darkest to brightest
  cellSize={12}                 // cell height in pixels
  scene="torus"                 // "lattice" (default) | "sphere" | "torus" | "asterisk"
  align="right"                 // "left" | "center" (default) | "right"
  spin={0.6}                    // how fast the form turns
  scanLine={false}
/>`,
};
