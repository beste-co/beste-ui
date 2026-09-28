import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "growing-tree",
  title: "Growing Tree",
  description:
    "A tree drawn like a fine ink botanical plate grows from a single point on Canvas 2D: a leader climbs while side shoots break away, twigs split and small blossoms open at the tips. Once grown it sways on springs in a passing breeze, every branch carrying the ones above it, and petals let go, tumble down and rest on the ground before they fade. A cursor moving across it sends a gust through the branches, and it can regrow a new tree now and then. Seed, complexity, growth time, colors, blossoms, petal fall, wind, sway and regrow are all props. Colors follow the theme, the petal count adapts to the device, it pauses offscreen and shows the grown tree still for reduced motion.",
  category: "Media",
  isAnimated: true,
  fullBleed: true,
  dependencies: [],
  usage: `import { GrowingTree } from "@/components/beste/component/growing-tree";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <GrowingTree className="absolute inset-0" />
  <div className="relative">...</div>
</section>

<GrowingTree
  className="min-h-[32rem]"
  seed={21}                        // a different tree, always the same for this seed
  complexity={0.8}                 // a fuller crown
  duration={12}                    // seconds to grow
  branchColor="var(--foreground)"  // any CSS color, tokens included
  blossomColor="#d9677a"
  fall={0.7}                       // more petals drifting down
  wind={0.3}                       // a calmer breeze
  regrow={0}                       // keep this tree
/>`,
};
