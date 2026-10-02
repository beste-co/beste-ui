import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric244",
  title: "Isometric White Label",
  description:
    "A page stands on a desk with a small badge plate in its footer. The badge slides down into a slot in the desk and a plain logo plate in the accent color rises out of the same slot to take its place, then the two swap back.",
  category: "Isometric",
  usage: `import { Isometric244 } from "@/components/beste/piece/isometric244";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric244 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Your brand on the site, not ours.
  </p>
</div>`,
};
