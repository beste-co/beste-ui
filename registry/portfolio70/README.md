# Portfolio70: Book Recommendations Grid

Grid of book cards for a reading list, each showing a portrait cover image, title, subtitle, a five-star rating, and an optional category badge.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/portfolio70"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/portfolio70"
```

This installs the block to `components/beste/block/portfolio70.tsx` and its dependencies.

## Quick start

The installed file exports `portfolio70Demo` alongside the block: the exact props behind the preview above. Spread it to get a working reading-list grid in one line.

```tsx
import { Portfolio70, portfolio70Demo } from "@/components/beste/block/portfolio70";

export default function ReadingPage() {
  return <Portfolio70 {...portfolio70Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Portfolio70 } from "@/components/beste/block/portfolio70";

export default function ReadingPage() {
  return (
    <Portfolio70
      heading="Currently reading"
      description="A few books worth your time this quarter."
      items={[
        {
          title: "Deep Work",
          subtitle: "Cal Newport",
          image: { src: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop", alt: "Deep Work book cover" },
          rating: 5,
          badge: "Productivity",
        },
        {
          title: "The Pragmatic Programmer",
          subtitle: "Hunt & Thomas",
          image: { src: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop", alt: "The Pragmatic Programmer book cover" },
          rating: 4,
        },
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
| `items` | `BookItem[]` | `[]` | Book cards rendered in the grid |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type BookItem = {
  title: string;
  subtitle?: string;
  image: { src: string; alt: string };
  rating: number;
  badge?: string;
};
```

## Behavior notes

- Ratings render as five `Star` icons; `item.rating` fills stars via `i < item.rating` on a zero-based loop, so non-integer ratings fill the same number of whole stars a `Math.floor` would (partial stars aren't supported).
- The cover image sits in a fixed `h-44 w-28` box and scales on hover (`group-hover/portfolio70:scale-105`), while the whole card also picks up a `hover:bg-muted/50` background change.
- The demo images are hosted on `oud.pics` rather than Unsplash; swap `image.src` for any accessible cover URL.
- `badge` renders as plain muted caption text below the stars, not a shadcn `Badge` component, and only appears when set.
