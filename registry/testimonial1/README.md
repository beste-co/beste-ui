# Testimonial1: Carousel Testimonials

A full-width, single-slide-per-view Embla carousel of customer quotes with optional autoplay and dot navigation: each slide centers a large quote, a circular avatar, the person's name, and their role.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/testimonial1"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/testimonial1"
```

This installs the block to `components/beste/block/testimonial1.tsx`, its `embla-carousel-react` and `embla-carousel-autoplay` npm dependencies, and the `badge` and `button` shadcn/ui primitives it depends on.

## Quick start

The installed file exports `testimonial1Demo` alongside the block: the exact props behind the preview above. Spread it to get a working carousel in one line.

```tsx
import { Testimonial1, testimonial1Demo } from "@/components/beste/block/testimonial1";

export default function LandingPage() {
  return <Testimonial1 {...testimonial1Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Testimonial1 } from "@/components/beste/block/testimonial1";

export default function LandingPage() {
  return (
    <Testimonial1
      heading="Loved by teams worldwide"
      description="Hear from the people who use our platform every day."
      testimonials={[
        {
          id: "testimonial-1",
          text: "This platform completely transformed how our team collaborates.",
          name: "Sarah Chen",
          role: "Engineering Manager at TechCorp",
          avatar: {
            src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
            alt: "Sarah Chen",
          },
        },
        {
          id: "testimonial-2",
          text: "We reduced our development time by 40% after switching.",
          name: "Emily Rodriguez",
          role: "CTO at Innovation Labs",
        },
      ]}
      autoplay
      autoplayDelay={4000}
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
| `testimonials` | `TestimonialItem[]` | – | Slides, in order (required prop) |
| `autoplay` | `boolean` | `true` | Enables the Embla autoplay plugin |
| `autoplayDelay` | `number` | `5000` | Milliseconds between autoplay advances |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type TestimonialItem = {
  id: string;
  text: string;
  name: string;
  role: string;
  avatar?: { src: string; alt: string };
};
```

## Behavior notes

- Returns `null` entirely when `testimonials` is empty or undefined, unlike most blocks in this batch which always render.
- Autoplay uses Embla's `stopOnInteraction: true`, so any manual drag or dot click permanently stops autoplay for that page view; it does not resume.
- Slides are configured `loop: true` with `align: "center"`, each occupying the full row width (`flex-[0_0_100%]`), so dragging past the last slide wraps back to the first.
- The dot navigation controls are real `<Button variant="ghost">` elements wrapping a small circle, not bare `<button>` tags, so they pick up standard button focus and hover styling.
- The dot row only renders when there is more than one testimonial; a single-item array shows the quote with no pagination controls.
