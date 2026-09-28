import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "crt-screen",
  title: "CRT Screen",
  description:
    "A tube television whose picture is a live WebGL CRT shader over cards painted to an offscreen canvas: barrel distortion, scanlines, an aperture grille, bloom, a rolling hum bar and static, with a channel-switch glitch every few seconds or on click that tunes through a title card, color bars and an amber slate. Channels, curvature, scanlines, grille, glow, noise, roll, glitch interval, click to tune and the housing are all props. The resolution adapts to the device, it pauses offscreen, shows a still picture for reduced motion that still changes on click, and a CSS scanline screen stands in without WebGL.",
  category: "Media",
  isAnimated: true,
  dependencies: [],
  usage: `import { CrtScreen } from "@/components/beste/component/crt-screen";

<CrtScreen
  className="max-w-3xl"
  channels={[
    { title: "The late show never signed off.", caption: "Rabbit Ear Archive" },
    { title: "Midnight double feature", caption: "Two noir pictures, back to back", look: "bars" },
    { title: "Cartoons before dawn", look: "slate" },
  ]}
  curvature={0.7}      // more bulge, 0 to 1
  scanlines={0.8}      // deeper lines, 0 to 1
  glitchInterval={0}   // only change channel on click
  bezel={false}        // just the glass, no housing
/>`,
};
