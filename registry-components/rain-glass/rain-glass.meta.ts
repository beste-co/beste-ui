import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "rain-glass",
  title: "Rain on Glass",
  description:
    "A live WebGL window on a rainy evening: the photo behind the glass sits out of focus, a fine mist clings to the pane, small droplets gather and larger drops break free and run down in stop-start paths, clearing trails that slowly mist over again. Every drop is a tiny lens showing a sharp, flipped view of the scene with a dark rim and a highlight, and the cursor wipes the mist like a finger. Blur, mist, droplet density, drop rate and size, refraction, tint and the wipe are all props. Adapts its resolution, pauses offscreen, holds a still pane for reduced motion and falls back to a blurred photo without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { RainGlass } from "@/components/beste/component/rain-glass";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <RainGlass
    className="absolute inset-0"
    src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=2000&q=80"
    alt="A city street at dusk"
  />
  <div className="relative">...</div>
</section>

<RainGlass
  className="min-h-[32rem]"
  src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=2000&q=80"
  blur={0.8}          // further out of focus, 0 to 1
  fog={0.4}           // lighter mist
  rate={0.8}          // more drops running down
  dropSize={0.7}      // larger drops
  tintColor="#e8c9a0" // warm mist, any CSS color
  recovery={0.2}      // wiped glass stays clear longer
/>`,
};
