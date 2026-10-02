import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric233",
  title: "Isometric Entity Identity",
  description:
    "An identity card for an organization stands on a desk stand, with a logo block and its name. The lines between its linked profiles draw in one after another, then a verified mark appears beside the name in the accent color.",
  category: "Isometric",
  usage: `import { Isometric233 } from "@/components/beste/piece/isometric233";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric233 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    One identity, everywhere you are listed.
  </p>
</div>`,
};
