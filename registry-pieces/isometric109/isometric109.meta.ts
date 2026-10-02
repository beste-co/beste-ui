import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric109",
  title: "Isometric Alarm Clock",
  description:
    "A twin-bell alarm clock stands on a small mat while its hands sweep around the dial. When the hour comes the clock shakes, the hammer rattles between the accent-colored bells and ring marks pop above it.",
  category: "Isometric",
  usage: `import { Isometric109 } from "@/components/beste/piece/isometric109";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric109 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Reminders sent 24 hours before every booking.
  </p>
</div>`,
};
