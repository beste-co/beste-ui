# Stats66: Outcome Metric Rows

Results section that gives every metric a hairline row of its own: an oversized figure on the left, the label and a sentence of context in the middle, and an optional year-over-year delta with a trend icon pinned right.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/stats66"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/stats66"
```

This installs the block to `components/beste/block/stats66.tsx` plus the `badge23` component it uses for the eyebrow.

## Quick start

The installed file exports `stats66Demo` alongside the block: the exact props behind the preview above. Spread it to get a working metrics section in one line.

```tsx
import { Stats66, stats66Demo } from "@/components/beste/block/stats66";

export default function Page() {
  return <Stats66 {...stats66Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Stats66 } from "@/components/beste/block/stats66";

export default function Page() {
  return (
    <Stats66
      badge={{ label: "Outcomes" }}
      heading="What changes in the first quarter"
      description="Measured against the same practices a quarter earlier."
      items={[
        {
          value: "31%",
          label: "Fewer no-shows",
          description: "Reminders go out on the member's own channel.",
          delta: "up from 24% last year",
        },
        {
          value: "4 days",
          label: "Faster to get paid",
          description: "Claims leave the same day the appointment closes.",
        },
      ]}
      footnote="Averages across 240 practices, measured over the first 90 days."
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string }` | – | Monospace eyebrow above the hairline rule, rendered via `Badge23` |
| `heading` | `string` | – | Section heading in the left column |
| `description` | `string` | – | Supporting paragraph, right-aligned from `md` up |
| `items` | `Metric[]` | `[]` | One hairline row per metric |
| `footnote` | `string` | – | Methodology line under the last row |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type Metric = {
  value: string;
  label: string;
  description: string;
  delta?: string;
};
```

## Behavior notes

- `value` is a string, not a number, so a row can read `31%`, `6.5h`, or `4 days` without a separate unit prop and without any formatting logic in the block.
- The delta column only renders when `delta` is set, and the row's three-column grid is `md:grid-cols-[minmax(0,14rem)_1fr_auto]`, so a missing delta leaves the middle column to take the space rather than a gap.
- Rows align on `md:items-baseline`, which puts the oversized figure and the label on the same baseline instead of centring a tall figure against a short one.
- The figure follows the set's metric scale (`text-4xl` rising to `md:text-6xl` in `font-light`) rather than a monospace face, so a page can carry this beside other Sirius sections without a second numeric voice appearing.
- The delta is styled as accent text with a `TrendingUp` icon regardless of direction, so a metric that fell should say so in the copy rather than expecting the block to flip the icon.
- Rows are separated by their own bottom rule under a shared top rule on the container, which is what closes the list off cleanly above the footnote.
