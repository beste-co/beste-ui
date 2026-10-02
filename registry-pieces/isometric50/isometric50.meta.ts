import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric50",
  title: "Isometric Microscope",
  description:
    "A lab microscope with a tall arm, a focus knob and an eyepiece looks down on its stage, where the glass slide lights up in the accent color and a soft glow pulses around it.",
  category: "Isometric",
  usage: `import { Isometric50 } from "@/components/beste/piece/isometric50";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric50 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Lab results back within 48 hours.
  </p>
</div>`,
};
