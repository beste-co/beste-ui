import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric143",
  title: "Isometric Gallery Frame",
  description:
    "A framed landscape painting in the accent color hangs on a gallery wall above a bench. A picture light switches on and brightens the canvas before it dims.",
  category: "Isometric",
  usage: `import { Isometric143 } from "@/components/beste/piece/isometric143";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric143 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Over 300 works on view, open 7 days a week.
  </p>
</div>`,
};
