# Health4: Wellness Hero Section

Split hero pairing large serif-scale typography with a full-bleed image, plus an optional floating testimonial card overlaid on the image corner. Built for yoga studios, meditation apps, and wellness retreat landing pages.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/health4"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/health4"
```

This installs the block to `components/beste/block/health4.tsx` and the shadcn/ui `button` primitive it depends on.

## Quick start

The installed file exports `health4Demo` alongside the block: the exact props behind the preview above. Spread it to get a working hero in one line.

```tsx
import { Health4, health4Demo } from "@/components/beste/block/health4";

export default function HomePage() {
  return <Health4 {...health4Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Health4 } from "@/components/beste/block/health4";

export default function HomePage() {
  return (
    <Health4
      eyebrow="Find your center"
      heading="Slow down. Breathe deep."
      description="Guided meditation and breathwork sessions built around your schedule, not the studio's."
      buttons={[
        { label: "Start a free session", href: "/start" },
        { label: "Our approach", href: "/approach", variant: "outline" },
      ]}
      image={{
        src: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=600&fit=crop",
        alt: "Person meditating at sunrise",
      }}
      imagePosition="left"
      floatingCard={{ quote: '"I finally sleep through the night."', author: "Priya K." }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `eyebrow` | `string` | – | Small uppercase label above the heading |
| `heading` | `string` | – | Hero heading, rendered as an `<h1>` |
| `description` | `string` | – | Supporting paragraph under the heading |
| `buttons` | `ButtonItem[]` | `[]` | CTA row under the description |
| `image` | `Image` | – | Hero image |
| `imagePosition` | `"left" \| "right"` | `"right"` | Which side the image sits on at the `lg` breakpoint |
| `floatingCard` | `FloatingCard` | – | Testimonial card overlaid on the image |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ButtonItem = {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
};

type Image = { src: string; alt: string };
type FloatingCard = { quote: string; author: string };
```

## Behavior notes

- `imagePosition` (default `"right"`) flips both the column order (the content block gets `lg:order-2` when `"left"`) and which corner the floating card hugs: the card sits on the side closest to the text column, `left-4` when the image is on the right and `right-4` when the image is on the left.
- `floatingCard` only renders when provided. It uses a translucent `bg-background/80` with `backdrop-blur-sm`, so it relies on the underlying image for contrast rather than a solid background.
- The image area is `aspect-[4/3]` on mobile and switches to `aspect-square` at `lg`, while `image` itself always uses `object-cover`.
- `heading` renders as an `<h1>`, so this block is meant to sit at the top of a page rather than mid-page.
