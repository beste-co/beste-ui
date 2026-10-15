import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "mascot1",
  title: "Bestie",
  description:
    "Bestie, the Beste mascot, drawn in WebGL. Turns toward the cursor, blinks, wobbles when pressed and dozes off when left alone.",
  category: "Mascot",
  dependencies: ["three"],
  isAnimated: true,
};
