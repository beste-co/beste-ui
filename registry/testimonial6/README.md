# Testimonial6: Centered Quote

A minimalist single-testimonial block: an optional badge, one large centered blockquote, and an author line with a square-ish framed avatar, name, and position separated by a bullet on wider screens.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/testimonial6"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/testimonial6"
```

This installs the block to `components/beste/block/testimonial6.tsx` and the `badge` shadcn/ui primitive it depends on.

## Quick start

The installed file exports `testimonial6Demo` alongside the block: the exact props behind the preview above. Spread it to get a working single-quote section in one line.

```tsx
import { Testimonial6, testimonial6Demo } from "@/components/beste/block/testimonial6";

export default function LandingPage() {
  return <Testimonial6 {...testimonial6Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Testimonial6 } from "@/components/beste/block/testimonial6";

export default function LandingPage() {
  return (
    <Testimonial6
      badge={{ label: "Testimonial", variant: "outline" }}
      quote="Switching to this platform completely changed how our team works."
      author={{
        name: "Ava Thompson",
        position: "Product Lead at NovaLabs",
        avatar: {
          src: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=150&h=150&fit=crop",
          alt: "Ava Thompson",
        },
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Optional badge above the quote |
| `quote` | `string` | – | The testimonial text (required prop) |
| `author` | `Author` | – | Name, position, and avatar shown below the quote |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type Author = {
  name: string;
  position?: string;
  avatar?: { src: string; alt: string };
};
```

## Behavior notes

- `quote` has no fallback text; the curly quotation marks always render around whatever string (or empty string) is passed.
- The avatar uses `rounded-xl` with a `ring-2 ring-border` outline rather than the fully circular avatar treatment used elsewhere in the Testimonial category.
- Name and position stack vertically on mobile and switch to a single row separated by a bullet character (`•`) at `md:` and above; the bullet itself is hidden below that breakpoint.
- `author`, `author.avatar`, and `author.position` are each independently optional, so a bare quote with no author block at all is a valid configuration.
