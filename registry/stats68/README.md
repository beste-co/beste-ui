# Stats68: Segmented Total Breakdown

A results section that leads on one oversized total, splits it across a segmented accent bar, then legends each segment on a hairline row aligning its value, share and what it covers.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/stats68"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/stats68"
```

This installs the block to `components/beste/block/stats68.tsx` plus the `badge23` and `button21` components it uses for the eyebrow and the action.

## Quick start

The installed file exports `stats68Demo` alongside the block: the exact props behind the preview above. Spread it to get a working breakdown in one line.

```tsx
import { Stats68, stats68Demo } from "@/components/beste/block/stats68";

export default function BreakdownPage() {
  return <Stats68 {...stats68Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Stats68 } from "@/components/beste/block/stats68";

export default function BreakdownPage() {
  return (
    <Stats68
      badge={{ label: "Where the hours go" }}
      heading="Ninety-six clinical hours, split four ways"
      description="One week at a four-site group, counted from the rota."
      totalValue="96"
      totalLabel="clinical hours booked last week"
      segments={[
        {
          label: "Consultations",
          value: "40 hrs",
          percent: 42,
          description: "First appointments and the longer reviews that follow a referral.",
        },
        {
          label: "Admin held in clinical rooms",
          value: "11 hrs",
          percent: 11,
          description: "Time a room was blocked for paperwork. Down from 23 hours.",
        },
      ]}
      footnote="Percentages are rounded to the nearest whole number."
      button={{ label: "See your own breakdown", href: "/reports" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string }` | – | Eyebrow above the hairline rule, rendered through `Badge23` |
| `heading` | `string` | – | Section heading in the left column of the header |
| `description` | `string` | – | Supporting paragraph, right-aligned from `md` up |
| `totalValue` | `string` | – | The headline total, set at display scale |
| `totalLabel` | `string` | – | What the total counts |
| `segments` | `Segment[]` | `[]` | The split, each with its share of the bar |
| `footnote` | `string` | – | Rounding note beside the action |
| `button` | `{ label: string; href: string }` | – | Outline action |
| `className` | `string` | – | Extra classes for the outer `section` |

```ts
type Segment = {
  label: string;
  value: string;
  percent: number;
  description: string;
};
```

## Behavior notes

- `percent` is a number and is used directly as an inline `width` on the bar, so the segments must add up to roughly one hundred yourself. Nothing is normalised, so a set summing to 80 leaves a visible gap and a set summing to 130 overflows.
- The bar tints come from a fixed four-step table of accent opacities, cycled with `index % segmentFills.length`. A fifth segment reuses the first tint, so four is the count this block is built for.
- The same table paints the legend swatch, which is what ties each row to its slice without a separate colour prop.
- The bar is `aria-hidden`, since every segment is repeated in the legend with its value and share as text.
- `value` and `percent` are separate columns rather than one derived from the other, so the value can carry its own unit like "40 hrs".
- Segment rows are a four-track grid from `md`: label and swatch, value, share, then the description. Below `md` they stack in that order.
- `footnote` is where the rounding caveat goes, which matters because the shares are authored rather than computed.
