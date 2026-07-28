# Testimonial8: Quote Cards Grid

A grid of testimonial cards, each with a large decorative quote glyph, an HTML-rendered quote body that supports inline emphasis tags, an author and role line, and an optional row of CTA buttons beneath the grid.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/testimonial8"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/testimonial8"
```

This installs the block to `components/beste/block/testimonial8.tsx` and the `badge` and `button` shadcn/ui primitives it depends on.

## Quick start

The installed file exports `testimonial8Demo` alongside the block: the exact props behind the preview above. Spread it to get a working quote grid in one line.

```tsx
import { Testimonial8, testimonial8Demo } from "@/components/beste/block/testimonial8";

export default function LandingPage() {
  return <Testimonial8 {...testimonial8Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Testimonial8 } from "@/components/beste/block/testimonial8";

export default function LandingPage() {
  return (
    <Testimonial8
      heading="What our users say"
      description="Don't just take our word for it."
      quotes={[
        {
          id: "quote-1",
          quote: "We cut our deployment time from hours to minutes.",
          author: "Sarah Chen",
          role: "CTO at Streamline",
        },
        {
          id: "quote-2",
          quote: "Our entire team was onboarded in <strong>a single day</strong>.",
          author: "Marcus Webb",
          role: "Engineering Lead at Pulse",
        },
        {
          id: "quote-3",
          quote: "The support team is phenomenal.",
          author: "Lisa Park",
          role: "Product Manager at Vertex",
        },
      ]}
      buttons={[{ id: "btn-1", label: "Read more stories", href: "https://beste.co" }]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Optional badge above the heading |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `quotes` | `TestimonialQuote[]` | `[]` | Cards rendered in the grid |
| `buttons` | `ButtonItem[]` | `[]` | CTAs rendered below the grid |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type TestimonialQuote = {
  id: string;
  quote: string;
  author?: string;
  role?: string;
};

type ButtonItem = {
  id: string;
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
};
```

## Behavior notes

- Returns `null` entirely when `quotes` is empty, so this section disappears completely rather than rendering an empty grid.
- Column count is picked by a dedicated `getGridColumns()` helper based on `quotes.length`: 1 quote stays single column, 2 becomes two columns at `md:`, counts divisible by 4 become four columns at `lg:`, and everything else (including the 3-quote demo) becomes three columns at `md:`.
- `quote.quote` is rendered through `dangerouslySetInnerHTML`, so inline HTML like `<strong>` is honored for emphasis (used in the demo's "within the hour" quote); any string passed here is trusted and rendered unescaped, so it should never come from untrusted input.
- Each card's decorative oversized quotation mark is absolutely positioned above the card's top edge (`-top-4`) at 20% opacity of the primary color, independent of the actual quote text length.
- Author name and role are each independently optional per card and simply omitted from the footer block when not provided.
