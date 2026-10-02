import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric239",
  title: "Isometric Site Protection",
  description:
    "A browser on a desk stand sits behind a thick gate panel with a lock and a password field. The password is typed dot by dot, the shackle of the lock lifts and the gate slides aside along its rail to show the page, then it slides back and locks again.",
  category: "Isometric",
  usage: `import { Isometric239 } from "@/components/beste/piece/isometric239";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric239 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Share the draft with a password.
  </p>
</div>`,
};
