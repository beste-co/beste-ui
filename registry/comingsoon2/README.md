# ComingSoon2: Development Progress Milestones

Coming-soon hero built around a derived progress bar: overall completion is computed from the ratio of completed milestones, driving both a shadcn `Progress` bar and a row of numbered milestone dots connected by a line. There is no timer or countdown in this block, only static milestone state.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/comingsoon2"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/comingsoon2"
```

This installs the block to `components/beste/block/comingsoon2.tsx`, plus the `badge` and `progress` shadcn/ui primitives it uses for the eyebrow badge and the progress bar.

## Quick start

The installed file exports `comingsoon2Demo` alongside the block: the exact props behind the preview above. Spread it to get a working progress tracker in one line.

```tsx
import { ComingSoon2, comingsoon2Demo } from "@/components/beste/block/comingsoon2";

export default function ComingSoonPage() {
  return <ComingSoon2 {...comingsoon2Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { ComingSoon2 } from "@/components/beste/block/comingsoon2";

export default function ComingSoonPage() {
  return (
    <ComingSoon2
      badge={{ label: "In Development", variant: "secondary" }}
      heading="Building something great"
      description="Here's where we are in our development journey."
      showProgress
      progressLabel="Development Progress"
      milestones={[
        { label: "Design", completed: true },
        { label: "Backend", completed: true },
        { label: "Frontend", completed: false },
        { label: "Launch", completed: false },
      ]}
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
| `showProgress` | `boolean` | `true` | Whether the progress bar and milestone track render at all |
| `progressLabel` | `string` | – | Caption above the progress bar |
| `milestones` | `Milestone[]` | `[]` | Stages plotted along the milestone track |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type Milestone = {
  label: string;
  completed: boolean;
};
```

## Behavior notes

- Progress is entirely derived, not configured directly: `completedCount / milestones.length * 100` feeds both the `Progress` bar value and the rounded percentage text underneath it (`Math.round(progress)`); there is no manual progress-value prop.
- The milestone track renders a connecting line (an absolutely positioned div) behind a row of dots; a completed milestone gets a filled primary-colored dot with a literal `✓` character (not a Lucide icon), an incomplete one gets a bordered muted dot with no glyph.
- The whole progress block, including the milestone track, only renders when `showProgress` is true; passing an empty `milestones` array still renders the bar itself sitting at 0%.
- Milestone dots are keyed and matched by `label`, not by index, so milestone labels should be unique within one instance to avoid rendering ambiguity.
