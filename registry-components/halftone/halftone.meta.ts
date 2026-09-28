import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "halftone",
  title: "Live Halftone",
  description:
    "A live WebGL print of any photo as a rotated halftone screen: dot size follows the photo's light, a slow wave travels through the dots, and the cursor presses a shaded 3D swell into the print that magnifies the dots beneath it and sends ripples through the screen as it moves. Ink and paper colors, dot size, screen angle, wave, speed, contrast, swell, swell size and ripples are all props. Ink and paper follow the theme by default, the resolution adapts to the device, it pauses offscreen, holds a still print for reduced motion and falls back to a grayscale photo without WebGL.",
  category: "Background",
  isAnimated: true,
  demoContentTone: "soft",
  demoContentOff: true,
  dependencies: [],
  usage: `import { Halftone } from "@/components/beste/component/halftone";

<Halftone
  className="aspect-[4/5]"
  src="https://images.unsplash.com/photo-1621983266286-09645be8fd01?w=2000&q=80"
  alt="A woman looking back over her shoulder"
  inkColor="var(--primary)"      // any CSS color, tokens included
  paperColor="var(--background)"
  dotSize={10}                   // distance between dots, in pixels
  angle={15}                     // screen angle, in degrees
  wave={0.3}                     // how much the wave swells the dots, 0 to 1
  contrast={0.7}                 // soft to punchy, 0 to 1
  bulge={0.8}                    // how far the print swells under the cursor, 0 to 1
  ripples={0.4}                  // ripples through the dots as the cursor moves
/>`,
};
