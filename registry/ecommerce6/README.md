# Ecommerce6: Product Reviews Section

Customer review list for product pages: an average-rating summary with a "Write a Review" button up top, then individual reviews with an avatar, verified badge, star rating, title, body copy, and a "Helpful" vote button, ending in an optional "Load More" footer.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/ecommerce6"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/ecommerce6"
```

This installs the block to `components/beste/block/ecommerce6.tsx` and the `Badge` and `Button` shadcn/ui primitives it uses.

## Quick start

The installed file exports `ecommerce6Demo` alongside the block: the exact props behind the preview above. Spread it to get a working reviews section in one line.

```tsx
import { Ecommerce6, ecommerce6Demo } from "@/components/beste/block/ecommerce6";

export default function ProductPage() {
  return <Ecommerce6 {...ecommerce6Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Ecommerce6 } from "@/components/beste/block/ecommerce6";

export default function ProductPage() {
  return (
    <Ecommerce6
      heading="Customer Reviews"
      averageRating={4.6}
      totalReviews={42}
      reviews={[
        {
          id: "rev-1",
          author: "Sarah M.",
          rating: 5,
          date: "2 days ago",
          title: "Absolutely love it!",
          content: "Quality exceeded my expectations, shipping was fast.",
          helpful: 24,
          verified: true,
        },
        {
          id: "rev-2",
          author: "James K.",
          rating: 4,
          date: "1 week ago",
          title: "Great product",
          content: "Very happy overall, delivery took a bit longer than expected.",
          helpful: 12,
        },
      ]}
      onHelpful={(id) => console.log("helpful vote", id)}
      onLoadMore={() => console.log("load more reviews")}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `string` | – | Section heading |
| `averageRating` | `number` | – | Summary star rating; hidden unless both this and `totalReviews` are set |
| `totalReviews` | `number` | – | Total review count shown next to the summary rating |
| `reviews` | `Review[]` | `[]` | Individual reviews rendered in a list |
| `onLoadMore` | `() => void` | – | Called by the footer "Load More Reviews" button; the button is hidden entirely when omitted |
| `onHelpful` | `(reviewId: string) => void` | – | Called with a review's `id` when its "Helpful" button is pressed |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type Review = {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful?: number;
  verified?: boolean;
};
```

## Behavior notes

- The average-rating summary (`averageRating` / `totalReviews`) only renders when both are truthy; each individual review always shows its own 5-star row regardless, using `Math.floor` on `rating` to decide filled stars (`size-5` in the summary, `size-3` per review).
- `onHelpful` fires with the review's `id`, and the "Helpful (N)" button itself only renders when `helpful` is defined on that review, a review that omits the field shows no vote button at all, even at zero votes.
- `onLoadMore` gates the entire footer button: omit the prop and "Load More Reviews" doesn't render, rather than rendering it disabled.
- The "Write a Review" button at the top has no `onClick` wired to any prop; it's static chrome the installer has to hook up separately.
- Reviewer photos are a plain `<img>` circle, not the shadcn `Avatar` primitive; a missing `avatar` falls back to a muted circle showing the author's first initial.
