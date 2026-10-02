import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric179",
  title: "Isometric Face Unlock",
  description:
    "A phone on a desk stand shows its lock screen: a scan line in the accent color sweeps a face frame, mesh points light up, the padlock opens and the lock screen slides away to reveal the home screen before it locks again.",
  category: "Isometric",
  usage: `import { Isometric179 } from "@/components/beste/piece/isometric179";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric179 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Sign in with a glance, no passwords.
  </p>
</div>`,
};
