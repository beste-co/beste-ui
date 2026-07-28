# Hero20: Split Carousel with Thumbnails

Two-column, near-fullscreen carousel (`lg:h-screen`): copy on the left, a rounded media card on the right with five selectable transition styles, an overlapping thumbnail strip at the bottom of the card, and a vertical progress rail on the far right (desktop only).

<ProCta />

## Installation

Swap `YOUR_EMAIL` and `YOUR_KEY` for the email and license key on your account. Find your license key on your [account page](/account).

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/hero20?email=YOUR_EMAIL&license_key=YOUR_KEY"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/hero20?email=YOUR_EMAIL&license_key=YOUR_KEY"
```

This installs the block to `components/beste/block/hero20.tsx`, the `Badge` and `Button` shadcn/ui primitives it uses, and `framer-motion` as an npm dependency.

## Quick start

The installed file exports `hero20Demo` alongside the block: the exact props behind the preview above. Spread it to get a working carousel in one line.

```tsx
import { Hero20, hero20Demo } from "@/components/beste/block/hero20";

export default function Page() {
  return <Hero20 {...hero20Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Hero20 } from "@/components/beste/block/hero20";

export default function Page() {
  return (
    <Hero20
      transition="reveal"
      slides={[
        {
          id: "slide-1",
          heading: "Design Without Limits",
          description: "Build stunning experiences without constraints.",
          image: {
            src: "https://images.unsplash.com/photo-1764009971892-6bf11e43f210?w=1600&auto=format&fit=crop",
            alt: "Abstract colorful design",
          },
          buttons: [{ id: "btn-1", label: "Start Creating", href: "/start" }],
        },
        {
          id: "slide-2",
          heading: "Collaborate in Real-time",
          image: {
            src: "https://images.unsplash.com/photo-1666585958614-ade385208fac?w=1600&auto=format&fit=crop",
            alt: "Creative collaboration workspace",
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
| `interval` | `number` | `5000` | Milliseconds between auto-advances; drives both progress indicators |
| `transition` | `TransitionType` | `"parallax"` | Enter/exit animation for the media card |
| `showThumbnails` | `boolean` | `true` | Thumbnail strip overlapping the bottom of the media card |
| `showArrows` | `boolean` | `true` | Prev/next chevrons inside the media card |
| `showProgress` | `boolean` | `true` | Per-thumbnail progress underline plus the vertical progress rail |
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

type TransitionType = "fade" | "parallax" | "reveal" | "morphism" | "curtain";
```

## Behavior notes

- On mobile the media card renders above the text (`order-1`/`order-2` on the two columns) and swaps to text-left/media-right only from `lg:` up, unlike most split heroes in this set which keep text first at every width.
- `transition` picks one of five Framer Motion variant sets: `parallax` is a spring pan with a scale kick, `reveal` wipes in with an animated `clip-path` polygon, `morphism` combines a heavy blur with desaturation (`saturate(0)` to `saturate(1)`), and `curtain` slides vertically; the media `<AnimatePresence>` runs in `mode="sync"` so slides cross-fade rather than hard-cut.
- The thumbnail strip overlaps the media card's bottom edge (`-bottom-4 lg:-bottom-6`, centered) and, when `showProgress` is on, the active thumbnail gets its own bottom-edge progress underline animating over the same `interval`, independent from the vertical rail.
- The vertical progress rail on the far right (`hidden lg:flex`) shows one bar per slide; the active bar fills top-to-bottom over `interval` milliseconds and freezes while `isPaused` is true, mirroring the thumbnail progress bar but rendered separately.
- Autoplay pauses on hover of the entire section (`onMouseEnter`/`onMouseLeave`), which freezes both progress animations simultaneously since they share the same `isPaused` state.
- The large "01 / 03" slide counter (desktop only, left column) and the media card's inset border overlay are purely decorative and do not respond to interaction.
