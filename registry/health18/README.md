# Health18: Care Programme Cards

Three hairline programme cards, each pairing a light programme name with a muted duration line, a short explanation, a checked list of what the programme includes, and a link into the full detail page.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/health18"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/health18"
```

This installs the block to `components/beste/block/health18.tsx` plus the `badge23` component it uses for the eyebrow.

## Quick start

The installed file exports `health18Demo` alongside the block: the exact props behind the preview above. Spread it to get a working programme grid in one line.

```tsx
import { Health18, health18Demo } from "@/components/beste/block/health18";

export default function ProgrammesPage() {
  return <Health18 {...health18Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Health18 } from "@/components/beste/block/health18";

export default function ProgrammesPage() {
  return (
    <Health18
      badge={{ label: "Programmes" }}
      heading="Care that runs on a plan, not on a reminder"
      description="Each programme is a template your team can start from."
      items={[
        {
          name: "First year of parenthood",
          meta: "12 weeks · weekly sessions",
          description: "A structured start for new families, with room to slow down.",
          includes: ["Fortnightly clinician review", "Between-session messaging"],
          link: { label: "See the programme", href: "/programmes/first-year" },
        },
        {
          name: "Long-term condition care",
          meta: "Ongoing · monthly reviews",
          description: "Steady follow-up for members who stay with you for years.",
          includes: ["Automatic recall before the plan lapses"],
          link: { label: "See the programme", href: "/programmes/long-term" },
        },
      ]}
      footnote="Every programme can be renamed or retired by your team."
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
| `items` | `Program[]` | `[]` | Programme cards, three to a row on `md` |
| `footnote` | `string` | – | Small print under the grid |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ActionLink = { label: string; href: string };

type Program = {
  name: string;
  meta: string;
  description: string;
  includes?: string[];
  link: ActionLink;
};
```

## Behavior notes

- `meta` is one free-text line, which is what lets a card read `12 weeks · weekly sessions` or `Ongoing · monthly reviews` without separate duration and cadence fields.
- The includes list takes `flex-1`, so the link is pinned to the bottom edge of every card in the row however uneven the lists are above it.
- `includes` is optional: a card without it drops both the list and the rule above it, and the link moves up to sit under the description.
- The card links are ordinary links at the foot of each card rather than the whole card being clickable, so a card carrying several ideas keeps one clear target.
- Cards deliberately carry no price and no primary button, which is what keeps a programme grid from reading as a pricing table.
- Hover lifts the card border to `hover:border-foreground/40` and nothing else moves, and the link runs its arrow nudge from its own named group.
