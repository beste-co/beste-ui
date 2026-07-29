# Logos13: Ruled Client Roster

Client proof band for the Auralis set: a parenthetical eyebrow and display heading sit beside a supporting paragraph, then every logo gets its own hairline-ruled cell with a plain caption naming the work it stands for, closed by a footnote and a pill CTA on a shared rule.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/logos13"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/logos13"
```

This installs the block to `components/beste/block/logos13.tsx` plus the `badge7` eyebrow and `button12` pill button it uses.

## Quick start

The installed file exports `logos13Demo` alongside the block: the exact props behind the preview above. Spread it to get a working logo band in one line.

```tsx
import { Logos13, logos13Demo } from "@/components/beste/block/logos13";

export default function Page() {
  return <Logos13 {...logos13Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Logos13 } from "@/components/beste/block/logos13";

export default function Page() {
  return (
    <Logos13
      badge={{ label: "The roster" }}
      heading="Nine years of work, mostly arriving by referral."
      description="The teams below handed us the pages their whole business runs through."
      items={[
        {
          src: "https://oud.pics/sm/l/logoipsum-380.png",
          alt: "Logoipsum",
          caption: "Editorial platform",
        },
        {
          src: "https://oud.pics/sm/l/logoipsum-388.png",
          alt: "Logoipsum",
          caption: "Museum wayfinding",
        },
      ]}
      button={{ label: "See the client work", href: "/work" }}
      labels={{ footnote: "Eleven of fourteen studios booked a second engagement." }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string }` | – | Eyebrow label rendered as a `Badge7` |
| `heading` | `string` | – | Display heading in the left column |
| `description` | `string` | – | Supporting paragraph, right-aligned from `md` up |
| `items` | `ClientLogo[]` | `[]` | One ruled cell per logo |
| `button` | `ActionButton` | – | Pill CTA on the closing rule, rendered as `Button12` |
| `labels` | `Logos13Labels` | `{}` | Fixed strings that are not content: the closing footnote |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ClientLogo = {
  src: string;
  alt: string;
  caption: string;
};

type ActionButton = {
  label: string;
  href: string;
};

type Logos13Labels = {
  footnote?: string;
};
```

## Behavior notes

- Logos render at a fixed `h-8` (`md:h-9`) with `w-auto object-contain`, so mixed wordmark and monogram files line up on the same optical height instead of being stretched into a shared box.
- They carry a constant `opacity-50 grayscale` with no hover state, which is the set's rule for logo walls: the marks stay quiet against the type rather than lighting up under the cursor.
- Each cell is a `border-t pt-6` rule instead of a boxed grid cell, so the band reads as an editorial index and keeps working when the count is not a multiple of the column count.
- The grid is `grid-cols-2` rising to `md:grid-cols-3`, so six logos fall into two clean rows on desktop and three on mobile.
- `caption` is what makes the block worth more than a logo strip: it names the engagement, so the section carries proof even for readers who do not recognise the marks.
- The footnote and the CTA share one closing `border-t` row and wrap onto separate lines on narrow screens via `flex-wrap`.
