import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "horizon-gradient",
  title: "Horizon Gradient",
  description:
    "A live WebGL sky gradient: up to six colors run from the zenith down to a hazy horizon, blended in Oklab, with a soft sun or moon sitting on the horizon line, a warm bloom around it and along the horizon, a shimmering trail below and thin cloud streaks that catch its light as they drift. A slow time-of-day drift eases the sky up and down its colors. Colors, sun color, size and position, horizon height, glow, haze, streaks, drift, speed, saturation and film grain are all props, and a new palette fades through over a set time; the sun leans a little toward the cursor. On load the sun rises out of the flat zenith color over 2.4 seconds. It adapts its resolution to the device, pauses offscreen, holds a still frame for reduced motion and falls back to a CSS sky without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { HorizonGradient } from "@/components/beste/component/horizon-gradient";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <HorizonGradient className="absolute inset-0" />
  <div className="relative">...</div>
</section>

// A pale blue morning with a small low sun on the right
<HorizonGradient
  className="min-h-[32rem]"
  colors={["#8fb8e8", "#bcd6f0", "#f3e6d8", "#ffe9c7"]}
  sunColor="#fffaf0"
  sunSize={0.2}
  sunX={0.72}
  horizon={0.22}
  streaks={0.6}
/>`,
};
