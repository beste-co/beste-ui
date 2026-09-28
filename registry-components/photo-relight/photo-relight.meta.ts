import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "photo-relight",
  title: "Photo Relight",
  description:
    "One architectural photograph relit across a whole day in WebGL: a cool dawn, a neutral midday, a warm golden hour with low raking light and lifted shadows, then sunset, blue hour and a deep night. The sky is regraded on its own, and after dusk the lights you trace on the photo switch on one by one. Each is a four-cornered shape that follows the photo's perspective and says what it is: a window lets only its glass glow with a warm room behind it while frames stay dark, a surface such as a timber ceiling is washed with light and keeps its grain, and water glows from within while the deck around it stays dark. Windows and surfaces spill a soft halo. The day follows a progress value or a live scroll source without re-rendering, or runs back and forth on its own. Warmth, night depth, light color, bloom, grain, horizon and crop focus are props. It only draws while the day is moving, pauses offscreen, holds golden hour for reduced motion and falls back to the plain photo with a shade for the hour.",
  category: "Media",
  isAnimated: true,
  dependencies: [],
  usage: `import { PhotoRelight } from "@/components/beste/component/photo-relight";

// Runs the day on its own
<PhotoRelight className="aspect-[3/2]" />

// Your own photo: trace each light by its four corners, 0 to 1 across and down the photo
<PhotoRelight
  className="aspect-[3/2]"
  imageSrc="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=2000&q=80"
  imageAlt="A white modernist house behind a long pool"
  lights={[
    { kind: "window", points: [[0.228, 0.468], [0.598, 0.468], [0.598, 0.645], [0.228, 0.645]] },
    { kind: "surface", points: [[0.16, 0.125], [0.646, 0.125], [0.646, 0.24], [0.215, 0.24]], color: "#ffc58a" },
    { kind: "water", points: [[0, 0.69], [0.59, 0.69], [0.97, 0.94], [0, 0.94]], color: "#5fd4f0", at: 0.8 },
  ]}
  progress={0.7}   // or a scroll MotionValue, read every frame without re-rendering
  warmth={0.9}
  nightDepth={0.8}
/>`,
};
