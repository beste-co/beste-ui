import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric130",
  title: "Isometric Toolbox",
  description:
    "The lid of a toolbox swings open over a tray in the accent color, and a hammer, a screwdriver and a wrench rise out of it. Then the tools sink back and the lid closes.",
  category: "Isometric",
  usage: `import { Isometric130 } from "@/components/beste/piece/isometric130";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric130 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Book a handyman for 1 hour or 1 whole day.
  </p>
</div>`,
};
