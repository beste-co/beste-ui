import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric198",
  title: "Isometric App Install",
  description:
    "A phone on a desk stand shows an app's store page: the Get button is pressed, a progress ring fills while the app downloads, and the button comes back as Open in the accent color.",
  category: "Isometric",
  usage: `import { Isometric198 } from "@/components/beste/piece/isometric198";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric198 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Installed in seconds, ready to open.
  </p>
</div>`,
};
