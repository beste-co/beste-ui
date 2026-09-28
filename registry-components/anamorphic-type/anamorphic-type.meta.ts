import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "anamorphic-type",
  title: "Anamorphic Type",
  description:
    "A statement cut into thousands of fragments traced from its own font and scattered in depth, so it only reads from one exact viewpoint. The camera slowly orbits and most of the time the fragments drift as an abstract constellation, then every few seconds it eases into the true angle, the words snap into focus, hold and fall apart again. The cursor steers the camera; its center is the true viewpoint. Density, depth, orbit, timing, fragment shape and colors are props. The real text stays in the page, the fragment count adapts to the device, it pauses offscreen and shows the resolved words for reduced motion.",
  category: "Text",
  isAnimated: true,
  cardScale: 0.5,
  dependencies: [],
  usage: `import { AnamorphicType } from "@/components/beste/component/anamorphic-type";

<AnamorphicType
  as="h1"
  text="It only makes sense from here."
  className="text-8xl font-semibold tracking-[-0.045em]"
/>

<AnamorphicType
  text="Stand where we stood."
  depth={0.8}                   // deeper scatter, more abstract off-axis
  orbit={0.3}                   // the camera strays less
  interval={4}                  // seconds between resolves
  hold={3}                      // seconds the words stay in focus
  fragment="dashes"             // "dots" (default) | "dashes"
  accentColor="var(--primary)"  // any CSS color, tokens included
  accent={0.15}                 // share of accent fragments
/>`,
};
