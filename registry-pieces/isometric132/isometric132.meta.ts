import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric132",
  title: "Isometric Lawn Mower",
  description:
    "A push mower in the accent color drives down a striped lawn and leaves a freshly cut lane behind it, then fades out at the far edge.",
  category: "Isometric",
  usage: `import { Isometric132 } from "@/components/beste/piece/isometric132";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric132 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Weekly lawn care from 25 dollars a visit.
  </p>
</div>`,
};
