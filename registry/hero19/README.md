# Hero19: Cinematic Fullscreen Carousel

Full-bleed, fullscreen image carousel (`h-screen`) with five selectable Framer Motion transition styles, staggered text entrance per slide, a bottom progress bar tied to the autoplay interval, and a hover-reveal "next slide" preview thumbnail in the corner.

<ProCta />

## Installation

Swap `YOUR_EMAIL` and `YOUR_KEY` for the email and license key on your account. Find your license key on your [account page](/account).

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/hero19?email=YOUR_EMAIL&license_key=YOUR_KEY"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/hero19?email=YOUR_EMAIL&license_key=YOUR_KEY"
```

This installs the block to `components/beste/block/hero19.tsx`, the `Badge` and `Button` shadcn/ui primitives it uses, and `framer-motion` as an npm dependency.

## Quick start

The installed file exports `hero19Demo` alongside the block: the exact props behind the preview above. Spread it to get a working carousel in one line.

```tsx
import { Hero19, hero19Demo } from "@/components/beste/block/hero19";

export default function Page() {
  return <Hero19 {...hero19Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Hero19 } from "@/components/beste/block/hero19";

export default function Page() {
  return (
    <Hero19
      transition="kenBurns"
      showArrows
      slides={[
        {
          id: "slide-1",
          heading: "Cinematic Visual Experience",
          description: "Fullscreen presentations with seamless transitions.",
          image: {
            src: "https://images.unsplash.com/photo-1748726254210-67249a8ba93e?w=1600&auto=format&fit=crop",
            alt: "Mountain landscape at sunset",
          },
          buttons: [{ id: "btn-1", label: "Get Started", href: "/start" }],
        },
        {
          id: "slide-2",
          heading: "Crafted for Excellence",
          image: {
            src: "https://images.unsplash.com/photo-1742812174813-1eebb4820037?w=1600&auto=format&fit=crop",
            alt: "Serene lake surrounded by mountains",
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
| `interval` | `number` | `6000` | Milliseconds between auto-advances; also the progress bar's fill duration |
| `transition` | `TransitionType` | `"fade"` | Enter/exit animation for the background image |
| `showDots` | `boolean` | `true` | Numbered dot navigation, bottom left |
| `showArrows` | `boolean` | `false` | Prev/next chevron buttons, vertically centered |
| `showPreview` | `boolean` | `true` | Next-slide preview thumbnail, bottom right, desktop only |
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

type TransitionType = "fade" | "slide" | "zoom" | "blur" | "kenBurns";
```

## Behavior notes

- Each `transition` value maps to its own Framer Motion `Variants`/`Transition` pair (`getSlideVariants`/`getTransitionConfig`): `slide` is a horizontal spring pan, `zoom` scales in/out, `blur` combines a blur filter with scale, and `kenBurns` is a slow 1.2s scale-only drift; the background `<AnimatePresence>` runs in `mode="sync"` so outgoing and incoming slides overlap.
- Autoplay pauses on `onMouseEnter` of the whole section and resumes on `onMouseLeave` (`isPaused` state); the bottom progress bar's width animation is keyed to `currentIndex` and freezes mid-fill (`width: isPaused ? undefined : "100%"`) rather than resetting, so hovering does not restart the bar.
- Badge, heading, description, and buttons stagger in per slide via a shared `textVariants` with `delay: custom * 0.12` (badge first, buttons last), inside an `AnimatePresence mode="wait"` keyed by slide index.
- The "next slide" preview (bottom right, `hidden md:flex`) is a clickable/keyboard-focusable div that previews `slides[currentIndex + 1]` and calls the same `paginate(1)` used by the arrows; its thumbnail image and label fade/slide into full opacity only on hover.
- The image gets three stacked gradient overlays (top-fade, left-fade, and a subtler bottom-fade) over a `bg-black` section, tuned for large white text rather than theme-adaptive colors.
- If `slides` is empty the component returns `null` (no fallback UI is rendered).
