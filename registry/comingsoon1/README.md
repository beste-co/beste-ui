# ComingSoon1: Countdown Timer Launch

Coming-soon hero with a real, ticking countdown: a `useCountdown` hook recomputes days, hours, minutes, and seconds against a target `launchDate` every second via `setInterval`, rendering four tabular-number tiles that count down live in the browser rather than showing a static snapshot.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/comingsoon1"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/comingsoon1"
```

This installs the block to `components/beste/block/comingsoon1.tsx`, plus the `badge` shadcn/ui primitive it uses for the eyebrow badge.

## Quick start

The installed file exports `comingsoon1Demo` alongside the block: the exact props behind the preview above. Spread it to get a working countdown in one line.

```tsx
import { ComingSoon1, comingsoon1Demo } from "@/components/beste/block/comingsoon1";

export default function ComingSoonPage() {
  return <ComingSoon1 {...comingsoon1Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { ComingSoon1 } from "@/components/beste/block/comingsoon1";

export default function ComingSoonPage() {
  return (
    <ComingSoon1
      badge={{ label: "Coming Soon", variant: "secondary" }}
      heading="Something amazing is on the way"
      description="We're working hard to bring you something special."
      launchDate="2026-08-01T09:00:00.000Z"
      showCountdown
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Section eyebrow badge |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `launchDate` | `string` | – | ISO date string the countdown ticks toward |
| `showCountdown` | `boolean` | `true` | Whether the countdown tiles render at all |
| `className` | `string` | – | Extra classes for the outer `<section>` |

## Behavior notes

- The countdown is a real, live-updating timer: `useCountdown` calls `calculateTimeLeft` once immediately on mount, then again every `1000`ms via `setInterval`, computing the difference between `new Date(launchDate)` and `new Date()` on each tick; the interval is cleared on unmount or whenever `launchDate` changes.
- The four tiles only render when both `showCountdown` is true and `launchDate` is set; omitting either hides the countdown entirely while badge, heading, and description still render.
- When `launchDate` is in the past (the computed difference is zero or negative), the hook clamps every field to zero and the tiles stay at `00`.
- Each value is zero-padded to two digits (`padStart(2, "0")`) and rendered with `tabular-nums` so the digits don't shift width as they tick down.
- The packaged demo's `launchDate` is computed once at module load (`Date.now() + 30 days`), so the countdown always starts near 30 days remaining as of whenever the page or module was first evaluated, not relative to each individual page view.
