import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "light-leak",
  title: "Light Leak Gradient",
  description:
    "A live WebGL film light leak: warm, saturated blooms of light burn in from the edges and corners of the frame the way stray light fogs a roll of film, swelling, drifting along the edge and fading while a gentle exposure flicker breathes through them. Each leak fringes slightly at its rim, the strongest light can clip into a warm, overexposed cream, and a film grain sits over the frame. Dark bases take the light additively like an unexposed frame; light bases take it as a warm stain. Colors, base, leak count, edges, size, intensity, burn, fringe, flicker, speed, saturation and grain are all props, a new palette fades through over a set time, and the nearest leak leans calmly toward the cursor. It grows softly out of its base color on load, adapts its resolution to the device, pauses offscreen, holds a still frame for reduced motion and falls back to soft CSS corner blooms without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { LightLeak } from "@/components/beste/component/light-leak";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <LightLeak className="absolute inset-0" />
  <div className="relative">...</div>
</section>

// Pale leaks on warm paper, only from the corners
<LightLeak
  className="min-h-[32rem]"
  baseColor="#f4ede2"
  colors={["#ff6b35", "#f7a072", "#e84a5f"]}
  edges="corners"
  burn={0.2}
  flicker={0}
/>`,
};
