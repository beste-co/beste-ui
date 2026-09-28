import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "dither-form",
  title: "Dither Form",
  description:
    "A live WebGL background that raymarches a 3D form and prints it with 1-bit ordered dithering at a chunky pixel size, turning toward the cursor. Ink and paper colors, pixel size, the form (torus, blobs or linked rings), the dither matrix, exposure, backdrop glow, speed and tilt are all props. Ink and paper follow the theme by default, the image dissolves softly in from bare paper on load, slower devices get chunkier pixels instead of dropped frames, it pauses offscreen and holds a still frame for reduced motion.",
  category: "Background",
  isAnimated: true,
  demoContentTone: "theme",
  dependencies: [],
  usage: `import { DitherForm } from "@/components/beste/component/dither-form";

// As a panel or a layer behind content
<DitherForm className="aspect-square" />

<DitherForm
  className="min-h-[32rem]"
  inkColor="var(--primary)"       // any CSS color, tokens included
  paperColor="var(--background)"
  pixelSize={4}                   // CSS pixels per dither dot
  shape="rings"                   // "torus" (default) | "blobs" | "rings"
  pattern="bayer4"                // "bayer8" (default) | "bayer4"
  exposure={0.7}                  // brighter form, 0 to 1
  tilt={0.8}                      // turns further toward the cursor
/>`,
};
