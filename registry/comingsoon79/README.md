# Comingsoon79: Maintenance Window Notice

A scheduled downtime notice with a light heading, a hairline table of what is affected and what is not, two actions and an image tile floating a live uptime strip.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/comingsoon79"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/comingsoon79"
```

This installs the block to `components/beste/block/comingsoon79.tsx`, the `indicator14` uptime piece it floats on the tile (installed to `components/beste/piece/indicator14.tsx`), and the `badge23` and `button21` components it uses for the eyebrow and the actions.

## Quick start

The installed file exports `comingsoon79Demo` alongside the block: the exact props behind the preview above. Spread it to get a working notice in one line.

```tsx
import { Comingsoon79, comingsoon79Demo } from "@/components/beste/block/comingsoon79";

export default function MaintenancePage() {
  return <Comingsoon79 {...comingsoon79Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Comingsoon79 } from "@/components/beste/block/comingsoon79";
import { Indicator14 } from "@/components/beste/piece/indicator14";

export default function MaintenancePage() {
  return (
    <Comingsoon79
      badge={{ label: "Scheduled maintenance" }}
      heading="Back at 06:00, and bookings are safe in the meantime"
      description="We are moving the scheduling database onto faster storage."
      details={[
        { label: "Window", value: "Sunday 02:00 to 06:00 UK" },
        { label: "Affected", value: "Web app and admin only" },
        { label: "Unaffected", value: "Member booking links and reminders" },
      ]}
      media={<Indicator14 title="Booking service" uptime="99.98%" range="Last 45 days" />}
      image={{ src: "/backdrops/green.jpg", alt: "Deep green gradient backdrop" }}
      buttons={[
        { label: "Follow the status page", href: "/status" },
        { label: "Read the change note", href: "/changelog" },
      ]}
      contactNote="If a clinic is opening inside this window, write to us."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string }` | – | Eyebrow above the heading, rendered through `Badge23` |
| `heading` | `string` | – | Notice heading, rendered as the page `h1` |
| `description` | `string` | – | Supporting paragraph, capped at `max-w-md` |
| `details` | `DetailRow[]` | `[]` | Label and value pairs describing the window |
| `media` | `ReactNode` | – | Live asset on the tile, `indicator14` in the demo |
| `image` | `{ src: string; alt: string }` | – | Backdrop behind the media tile |
| `buttons` | `ActionLink[]` | `[]` | Actions in source order, first solid and the rest outlined |
| `contactNote` | `string` | – | Escalation line under the actions |
| `className` | `string` | – | Extra classes for the outer `section` |

```ts
type ActionLink = {
  label: string;
  href: string;
};

type DetailRow = {
  label: string;
  value: string;
};
```

## Behavior notes

- The heading is an `h1`, since this block is designed to be the whole page during a maintenance window rather than a section of a longer one.
- The details table is a real `dl`, and the demo pairs an "Affected" row with an "Unaffected" one on purpose. Stating what still works is the part that stops support tickets.
- Rows use `flex-wrap` with `items-baseline`, so a long value wraps below its label on narrow screens instead of crushing it.
- Rows carry `border-t` with `last:border-b`, closing the table rather than leaving it open.
- Button tones are positional and not overridable: the first is `primary`, later ones are `outline`. The `ActionLink` type has no `tone` field.
- The layout is `lg:grid-cols-2` with `lg:items-center`, so the tile stays centered against the copy column rather than aligning to its top edge.
- Nothing here counts down or refreshes. Window times are plain strings, which keeps the page safe to statically render and cache during an outage, when dynamic rendering is least likely to be available.
