import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "photo-drift",
  title: "Photo Drift",
  description:
    "A photograph in a fixed frame that drifts a little slower than the page as it scrolls past, and blurs into focus from a slight zoom once it has loaded. The frame takes any size, ratio and radius from its classes, the drift is one number, and reduced motion holds the photo still.",
  category: "Media",
  isAnimated: true,
  dependencies: [],
  usage: `import { PhotoDrift } from "@/components/beste/component/photo-drift";

<PhotoDrift
  src="https://oud.pics/b/dental/mira-reception.webp"
  alt="A calm reception lounge"
  className="aspect-4/3 w-full rounded-4xl"
  drift={0.08}     // share of the frame height, 0 holds it still
  priority         // above the fold: load straight away
/>`,
};
