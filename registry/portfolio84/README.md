# Portfolio84: Work Process Steps

Four-column numbered process section: a large faded index number sits above each step's title and description.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/portfolio84"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/portfolio84"
```

This installs the block to `components/beste/block/portfolio84.tsx` and its dependencies.

## Quick start

The installed file exports `portfolio84Demo` alongside the block: the exact props behind the preview above. Spread it to get a working process section in one line.

```tsx
import { Portfolio84, portfolio84Demo } from "@/components/beste/block/portfolio84";

export default function ProcessPage() {
  return <Portfolio84 {...portfolio84Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Portfolio84 } from "@/components/beste/block/portfolio84";

export default function ProcessPage() {
  return (
    <Portfolio84
      heading="How we work"
      description="A simple, transparent process from kickoff to launch."
      items={[
        { badge: "01", title: "Kickoff", description: "Align on goals, scope, and timeline." },
        { badge: "02", title: "Build", description: "Design and development in weekly sprints." },
        { badge: "03", title: "Launch", description: "QA, handoff, and go-live support." },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `items` | `StepItem[]` | `[]` | Process steps rendered across the grid |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type StepItem = {
  badge: string;
  title: string;
  description: string;
};
```

## Behavior notes

- `badge` (e.g. "01") is not a shadcn `Badge`; it's plain text rendered at `text-5xl font-bold text-primary/20`, giving the numeral a faint watermark look behind the title.
- The grid is `md:grid-cols-2 lg:grid-cols-4`, so on medium screens four steps wrap into two rows of two before reaching the full four-column layout at `lg`.
- There is no connecting line, arrow, or hover state between steps; each column is fully static text with no interactivity.
