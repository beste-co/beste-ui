import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "ferrofluid",
  title: "Ferrofluid",
  description:
    "A live WebGL pool of glossy black magnetic fluid in a shallow dish, seen from a low studio camera so the spikes stand in profile. A magnet (the cursor anywhere over it, or an invisible one hovering over the pool when idle) raises a crown of sharp needle spikes on a hexagonal lattice that grow with proximity, lean toward the pull and relax into a smooth liquid dome when it leaves, lit by an overhead key, a strip light and a rim light. Fluid, surface and light colors, pool size, spike density and height, reach, response, gloss and highlight are props. The pull is spring-smoothed so nothing flickers, a still pool stops redrawing, the resolution adapts to the device, and reduced motion holds one settled crown.",
  category: "Media",
  isAnimated: true,
  fullBleed: true,
  dependencies: [],
  usage: `import { Ferrofluid } from "@/components/beste/component/ferrofluid";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <Ferrofluid className="absolute inset-0" />
  <div className="relative">...</div>
</section>

<Ferrofluid
  className="min-h-[32rem]"
  surfaceColor="var(--muted)"   // any CSS color, tokens included
  density={0.8}                 // more, finer spikes
  spikeHeight={0.9}             // taller crown
  response={0.3}                // heavier, slower fluid
  idleMagnet={false}            // stays smooth until the cursor comes near
/>`,
};
