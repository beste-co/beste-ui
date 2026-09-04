import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text10",
  title: "Photo Fill",
  description:
    "Large serif letters filled with a photograph that drifts slowly inside them as the page scrolls, the picture showing through the type.",
  category: "Text",
  dependencies: ["framer-motion"],
  usage: `import { Text10 } from "@/components/beste/component/text10";

<Text10
  as="h1"
  text="Breathe"
  image={{ src: "/photos/hills.jpg", alt: "Fog over green hills" }}
  drift={30}                          // percent the photo travels while scrolling
  className="font-serif text-9xl"
/>`,
};
