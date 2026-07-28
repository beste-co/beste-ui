# Faq80: Two Column Answer Grid

Always-open FAQ: a monospace eyebrow over a hairline rule and a two-column heading, then every question and answer laid out as a numbered, hairline-separated cell in a two-column grid, closing on a soft support panel that pairs a short prompt with one or two actions.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/faq80"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/faq80"
```

This installs the block to `components/beste/block/faq80.tsx` plus the `badge23` and `button21` components it uses for the eyebrow and the support actions.

## Quick start

The installed file exports `faq80Demo` alongside the block: the exact props behind the preview above. Spread it to get a working FAQ in one line.

```tsx
import { Faq80, faq80Demo } from "@/components/beste/block/faq80";

export default function Page() {
  return <Faq80 {...faq80Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Faq80 } from "@/components/beste/block/faq80";

export default function Page() {
  return (
    <Faq80
      badge={{ label: "Answers" }}
      heading="Everything teams ask before they move"
      description="The details that usually decide it are written down here."
      items={[
        {
          question: "How long does a migration take?",
          answer: "Most teams are live within a week, imports included.",
        },
        {
          question: "Who owns the data we bring in?",
          answer: "You do. Export everything at any time, in an open format.",
        },
      ]}
      support={{
        title: "Still weighing something up?",
        description: "Send the question over and a real person answers.",
        buttons: [
          { label: "Talk to the team", href: "/contact" },
          { label: "Read the docs", href: "/docs", tone: "outline" },
        ],
      }}
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
| `items` | `FaqItem[]` | `[]` | Question and answer cells, numbered in source order |
| `support` | `Support` | – | Soft panel under the grid, with its own actions |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ActionLink = {
  label: string;
  href: string;
  tone?: "primary" | "neutral" | "outline";
};

type FaqItem = { question: string; answer: string };

type Support = {
  title: string;
  description: string;
  buttons?: ActionLink[];
};
```

## Behavior notes

- There is no accordion and no open state: every answer is in the DOM and visible at all times, so the copy is crawlable and `Cmd+F` finds it. Nothing here is client-interactive beyond the links.
- The counter is positional, not data-driven. Each cell prints `String(index + 1).padStart(2, "0")`, so entries read `01`, `02`, and reordering `items` renumbers them.
- The grid fills column by column in DOM order (`md:grid-cols-2`), so questions 1 and 2 sit side by side, not stacked down one column. Order the list with that reading path in mind.
- Cells carry a `border-t` rather than a bottom rule, which keeps a rule above every row of the grid and leaves the bottom edge open into the support panel.
- Every button in `support.buttons` runs through `Button21` with its own `tone`, so the first can stay solid while the rest fall back to the hairline outline; omitting `buttons` renders the panel as copy only.
- The support panel sits on a solid `bg-muted` fill, not a tinted or bordered card, which is why it reads as a soft closing block rather than another FAQ cell.
