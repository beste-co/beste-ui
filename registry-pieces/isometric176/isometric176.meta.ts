import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric176",
  title: "Isometric Incoming Call",
  description:
    "A phone on a small desk stand rings: rings spread from the caller's picture, the accept button in the accent color breathes and the phone buzzes in short bursts, then the call is answered and a timer and a level meter take over.",
  category: "Isometric",
  usage: `import { Isometric176 } from "@/components/beste/piece/isometric176";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric176 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Never miss a customer call again.
  </p>
</div>`,
};
