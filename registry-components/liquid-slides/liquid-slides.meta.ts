import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "liquid-slides",
  title: "Liquid Slides",
  description:
    "A WebGL photo slideshow that swaps images through a noise-displaced liquid wipe with a wet rim and a slight color split, under a thin timeline that reads like stories: shown slides stay full, the current one fills with time and the next start empty. It advances on a timer, a click, the arrows or the keyboard, pauses its timer on hover and ripples the photo under the cursor. Timing, distortion, edge detail, color split, push-in and every control are props. All photos preload first, it falls back to crossfading images without WebGL and switches instantly for reduced motion.",
  category: "Media",
  isAnimated: true,
  dependencies: [],
  usage: `import { LiquidSlides } from "@/components/beste/component/liquid-slides";

<LiquidSlides
  className="aspect-[4/5] md:aspect-[16/10]"
  slides={[
    { src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&q=80", alt: "A model leaning on a teal wall" },
    { src: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1400&q=80", alt: "A woman walking down a city street" },
  ]}
  labels={{ carousel: "Lookbook", previous: "Previous look", next: "Next look" }}
  interval={5}        // seconds per slide
  transition={1.2}    // seconds per wipe
  distortion={0.7}    // how far the wet edge drags, 0 to 1
  pauseOnHover
/>`,
};
