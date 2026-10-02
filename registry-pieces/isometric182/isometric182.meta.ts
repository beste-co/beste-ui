import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric182",
  title: "Isometric Phone Camera",
  description:
    "A phone held in a small tripod clamp shows a camera viewfinder. Focus brackets close in on the subject and lock in the accent color, the shutter presses, the screen flashes and the shot flies into the gallery thumbnail.",
  category: "Isometric",
  usage: `import { Isometric182 } from "@/components/beste/piece/isometric182";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric182 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Shoot product photos with the phone you have.
  </p>
</div>`,
};
