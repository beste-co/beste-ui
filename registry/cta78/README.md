# Cta78: Studio Booking Split CTA

Closing call to action that puts a tall photo against the pitch: a parenthetical eyebrow, an oversized heading, a short paragraph, a pill CTA beside a plain email link, then a ruled two-column row stating reply time and next availability so the ask carries its own terms.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/cta78"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/cta78"
```

This installs the block to `components/beste/block/cta78.tsx` plus the `badge7` eyebrow and `button12` pill button it uses.

## Quick start

The installed file exports `cta78Demo` alongside the block: the exact props behind the preview above. Spread it to get a working closing section in one line.

```tsx
import { Cta78, cta78Demo } from "@/components/beste/block/cta78";

export default function Page() {
  return <Cta78 {...cta78Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Cta78 } from "@/components/beste/block/cta78";

export default function Page() {
  return (
    <Cta78
      badge={{ label: "Open commissions" }}
      heading="Bring the brief you keep rewriting."
      description="One hour, one room, and the version of the problem you have not written down yet."
      image={{ src: "/studio/meeting-room.jpg", alt: "Studio meeting room lit by a tall window" }}
      button={{ label: "Book a studio hour", href: "/contact" }}
      link={{ label: "Or send the brief by email", href: "mailto:studio@example.com" }}
      details={[
        { title: "First reply", value: "Within two days" },
        { title: "Next opening", value: "September" },
      ]}
      labels={{ note: "No deck, no paid discovery phase." }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string }` | – | Eyebrow label rendered as a `Badge7` |
| `heading` | `string` | – | Plain-text heading above the pitch |
| `description` | `string` | – | Supporting paragraph under the heading |
| `image` | `{ src: string; alt: string }` | – | Tall photo filling the left half |
| `button` | `ActionButton` | – | Primary pill CTA, rendered as `Button12` |
| `link` | `ActionButton` | – | Secondary underlined text link beside the pill |
| `details` | `DetailRow[]` | `[]` | Ruled key and value pairs under the actions |
| `labels` | `Cta78Labels` | `{}` | Fixed strings that are not content: the closing note |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ActionButton = {
  label: string;
  href: string;
};

type DetailRow = {
  title: string;
  value: string;
};

type Cta78Labels = {
  note?: string;
};
```

## Behavior notes

- `heading` renders as plain text, not an HTML string: there is no inline highlight markup to escape, and emphasis comes from the size jump to `md:text-5xl lg:text-6xl` on a tight `leading-[0.95]` instead of a recoloured phrase.
- The image sits in a fixed `aspect-[4/5]` box (`md:aspect-[3/4]`) with `object-cover`, so a landscape or square source still fills the column without stretching, and the two halves stay balanced on `md:items-center`.
- Photos in this set stay full colour and take no hover treatment: no zoom, no grayscale, no border change.
- `details` render as ruled `border-t` pairs rather than a boxed grid, which is the set's pattern for facts and specs and keeps the row from reading as a second card.
- Both actions are optional and share one `flex-wrap` row, so a pill on its own, a text link on its own, or both side by side all lay out correctly.
- The block stacks to a single column below `md` with the photo on top, so the ask still lands above the fold on a phone.
