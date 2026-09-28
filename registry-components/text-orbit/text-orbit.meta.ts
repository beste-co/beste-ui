import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text-orbit",
  title: "Text Orbit",
  description:
    "A round photo encircled by rings of text set on SVG paths, each turning at its own speed and direction, with any ring tilted into a Saturn-like orbit that passes behind and in front of the photo. The whole object leans toward the cursor in 3D, sways on its own when nobody is pointing and floats over a faded reflection. Rings, speed, lean, sway and the reflection are props; the ring type takes its font from the component's own classes. Pauses offscreen and holds still for reduced motion.",
  category: "Text",
  isAnimated: true,
  cardScale: 0.5,
  dependencies: [],
  usage: `import { TextOrbit } from "@/components/beste/component/text-orbit";

<TextOrbit
  className="mx-auto max-w-[520px] font-serif"
  color="var(--primary)"          // any CSS color, tokens included
  image={{ src: "https://images.unsplash.com/photo-1622618991746-fe6004db3a47?w=2000&q=80", alt: "A perfume bottle" }}
  imageScale={1.7}                // zoom of the round photo
  imageFocus="28% 56%"            // where the zoom centers
  rings={[
    { text: "Ember No. 9 · Eau de parfum ·", radius: 1.04, depth: 70 },
    { text: "Bitter orange · Fig leaf · Smoked amber ·", radius: 0.8, speed: 1.7, direction: "counterclockwise" },
    { text: "Composed in Grasse ·", radius: 1.32, speed: 0.7, tilt: 74 }, // tilted orbit
  ]}
  speed={0.6}       // global turning speed
  tilt={0.8}        // lean toward the cursor, 0 to 1
  sway={0.3}        // drift on its own, 0 to 1
  reflection={false}
/>`,
};
