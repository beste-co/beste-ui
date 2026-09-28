import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "reaction-diffusion",
  title: "Reaction Diffusion",
  description:
    "A live Gray-Scott reaction-diffusion simulation in WebGL that grows coral and fingerprint patterns across the surface, run on a small ping-pong grid and upscaled with a relief-shaded display pass. Ink, paper and accent colors, feed and kill rates, grid detail, growth speed, self-seeding, a drifting eraser, front accent and relief are all props; growth can steer around an element you pass by ref, and the cursor or a tap seeds new colonies. It fades up softly out of its paper color on load, steps per frame adapt to the device, it pauses offscreen, grows one settled still frame for reduced motion and falls back to a CSS pattern without WebGL.",
  category: "Background",
  isAnimated: true,
  demoContentTone: "theme",
  dependencies: [],
  usage: `import { ReactionDiffusion } from "@/components/beste/component/reaction-diffusion";
import { useRef } from "react";

// Growth steers around the text block you pass as avoidRef
const copy = useRef<HTMLDivElement>(null);

<section className="relative min-h-[40rem]">
  <ReactionDiffusion className="absolute inset-0" avoidRef={copy} />
  <div ref={copy} className="relative max-w-2xl">...</div>
</section>

<ReactionDiffusion
  className="min-h-[32rem]"
  inkColor="var(--foreground)"   // any CSS color, tokens included
  accentColor="var(--primary)"
  feed={0.037}                   // thinner, wormier pattern
  kill={0.06}
  resolution={0.8}               // finer grid
  seeding={0.2}                  // seeds itself less often
/>`,
};
