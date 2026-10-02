import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric228",
  title: "Isometric SSL Certificate",
  description:
    "A browser leans on its desk stand with a tall address bar. The padlock at the head of the bar snaps shut and takes the accent color, and the check on the seal of the certificate standing beside it draws itself in.",
  category: "Isometric",
  usage: `import { Isometric228 } from "@/components/beste/piece/isometric228";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric228 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Secure from the first visit.
  </p>
</div>`,
};
