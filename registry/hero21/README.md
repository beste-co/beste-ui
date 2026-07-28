# Hero21: Fullscreen Vertical Carousel

Fullscreen (`h-screen`), dark carousel over a fixed `bg-neutral-950` surface, with five 3D-capable Framer Motion transitions (including a rotating cube), faint decorative grid lines, and a single `accentColor` prop that tints the active dot, progress bar, and divider with a raw hex color rather than a semantic Tailwind token.

<ProCta />

## Installation

Swap `YOUR_EMAIL` and `YOUR_KEY` for the email and license key on your account. Find your license key on your [account page](/account).

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/hero21?email=YOUR_EMAIL&license_key=YOUR_KEY"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/hero21?email=YOUR_EMAIL&license_key=YOUR_KEY"
```

This installs the block to `components/beste/block/hero21.tsx`, the `Badge` and `Button` shadcn/ui primitives it uses, and `framer-motion` as an npm dependency.

## Quick start

The installed file exports `hero21Demo` alongside the block: the exact props behind the preview above. Spread it to get a working carousel in one line.

```tsx
import { Hero21, hero21Demo } from "@/components/beste/block/hero21";

export default function Page() {
  return <Hero21 {...hero21Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Hero21 } from "@/components/beste/block/hero21";

export default function Page() {
  return (
    <Hero21
      transition="cube"
      accentColor="#22c55e"
      slides={[
        {
          id: "slide-1",
          heading: "Discover the Future",
          description: "Where imagination meets reality.",
          image: {
            src: "https://images.unsplash.com/photo-1765706729547-57ad9c7f2814?w=1600&auto=format&fit=crop",
            alt: "Digital globe visualization",
          },
          buttons: [{ id: "btn-1", label: "Explore Now", href: "/explore" }],
        },
        {
          id: "slide-2",
          heading: "Build Tomorrow",
          image: {
            src: "https://images.unsplash.com/photo-1765706729287-953837a94f4d?w=1600&auto=format&fit=crop",
            alt: "Technology circuit board",
          },
        },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `slides` | `HeroSlide[]` | – | Slide data; required |
| `autoPlay` | `boolean` | `true` | Auto-advances on the `interval` timer |
| `interval` | `number` | `5000` | Milliseconds between auto-advances; drives the bottom progress bar |
| `transition` | `TransitionType` | `"slide"` | Enter/exit animation for the background image |
| `showCounter` | `boolean` | `true` | Large faded slide-number counter, left side, desktop only |
| `showNavDots` | `boolean` | `true` | Vertical dot navigation, right side |
| `showArrows` | `boolean` | `true` | Up/down paginate buttons, bottom center |
| `accentColor` | `string` | `"#7590ca"` | Raw hex/CSS color applied via inline `style`, not a Tailwind class |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type HeroSlide = {
  id: string;
  badge?: { label: string; variant?: "default" | "secondary" | "outline" };
  heading?: string;
  description?: string;
  image?: { src: string; alt: string };
  buttons?: ButtonItem[];
};

type ButtonItem = {
  id: string;
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
  icon?: React.ReactNode;
};

type TransitionType = "fade" | "slide" | "scale" | "flip" | "cube";
```

## Behavior notes

- `transition="slide"` moves the background vertically (`y` axis), not horizontally like the other carousels in this set; `flip` rotates on the X axis and `cube` rotates on the Y axis with `x` translation, both rendered inside a wrapper with `style={{ perspective: "1200px" }}` for the 3D effect.
- `accentColor` is the only prop in this hero group that takes a literal color value: it is applied with inline `style={{ backgroundColor: accentColor }}` (or the equivalent for the divider) to the active nav dot, the counter's vertical divider line, and the bottom progress bar, so it works with any valid CSS color string, not just design-token classes.
- Up/down paginate buttons at the bottom control the same vertical direction as the `slide` transition; a "01 / 03" text readout sits between them regardless of which `transition` is active.
- The nav dots on the right elongate from a `2x2` circle to a `3x8` pill when active, tinted with `accentColor`.
- Autoplay pauses on hover of the whole section; the progress bar's width animation freezes rather than resets while paused (`width: isPaused ? undefined : "100%"`).
- Background section color is a fixed `bg-neutral-950`, independent of the site's light/dark theme, with two black gradient overlays on the image (top and left) for text legibility; the faint decorative grid lines are `absolute` positioned white-at-5%-opacity lines, purely visual.
