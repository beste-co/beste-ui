import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric202",
  title: "Isometric AI Site Builder",
  description:
    "A chat panel stands beside a browser on one desk: a prompt in the accent color slides into the thread, the assistant shows it is working, and the page fills in section by section from the navbar down to the footer before the reply confirms it is done.",
  category: "Isometric",
  usage: `import { Isometric202 } from "@/components/beste/piece/isometric202";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric202 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Describe the site, watch it build.
  </p>
</div>`,
};
