# Hero24: Wellness Hero with Stats Cards

Split-layout hero for health and wellness products: copy and social proof on the left, a portrait image on the right set inside a layered rotated-card effect, with an optional floating "heart rate" chip in the top corner and a progress bar plus quote overlaid at the bottom of the image.

<ProCta />

## Installation

Swap `YOUR_EMAIL` and `YOUR_KEY` for the email and license key on your account. Find your license key on your [account page](/account).

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/hero24?email=YOUR_EMAIL&license_key=YOUR_KEY"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/hero24?email=YOUR_EMAIL&license_key=YOUR_KEY"
```

This installs the block to `components/beste/block/hero24.tsx` and the `Badge` and `Button` shadcn/ui primitives it uses.

## Quick start

The installed file exports `hero24Demo` alongside the block: the exact props behind the preview above. Spread it to get a working hero in one line.

```tsx
import { Hero24, hero24Demo } from "@/components/beste/block/hero24";

export default function Page() {
  return <Hero24 {...hero24Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Hero24 } from "@/components/beste/block/hero24";

export default function Page() {
  return (
    <Hero24
      heading="Your Body, Your Balance."
      description="Personalized nutrition plans, mindfulness practices, and sleep analysis."
      buttons={[{ id: "btn-1", label: "Try for Free", href: "/signup" }]}
      image={{
        src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&auto=format&fit=crop",
        alt: "Yoga wellness",
      }}
      floatingCard={{ enabled: true, label: "Heart Rate", value: "72 BPM" }}
      progressCard={{ enabled: true, label: "Daily Goal", progress: 84 }}
      socialProof={{ rating: 5, memberCount: "10,000+ Happy Members" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; icon?: React.ReactNode; variant?: "default" \| "secondary" \| "outline" }` | – | Optional pill badge, can include a leading icon node |
| `heading` | `string` | – | Main headline |
| `description` | `string` | – | Supporting paragraph |
| `buttons` | `ButtonItem[]` | – | CTA buttons under the description |
| `socialProof` | `SocialProof` | – | Avatar stack, star rating, and member-count line |
| `image` | `{ src: string; alt: string }` | – | Portrait image on the right |
| `floatingCard` | `{ enabled?: boolean; label?: string; value?: string }` | – | Small overlay chip pinned top-left of the image |
| `progressCard` | `{ enabled?: boolean; label?: string; progress?: number }` | – | Progress bar overlay pinned near the bottom of the image |
| `quote` | `string` | – | Short quote line under the progress card |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type SocialProof = {
  avatars?: Avatar[];
  rating?: number;
  memberCount?: string;
};

type Avatar = { id: string; src: string; alt: string };

type ButtonItem = {
  id: string;
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
  icon?: React.ReactNode;
};
```

## Behavior notes

- The image is set inside two absolutely positioned, rotated background divs (`rotate-6`/`-rotate-3`, low opacity, scaled down) behind the actual photo, producing a layered "stack of cards" look without any extra image assets.
- `floatingCard` only renders when `floatingCard.enabled` is `true`; it is a small `bg-background/90 backdrop-blur` chip in the top-left corner of the image with a heart icon, independent of `progressCard`.
- `progressCard` only renders when `progressCard.enabled` is `true`; its width-based bar (`style={{ width: `${progressCard.progress}%` }}`) is computed directly from the `progress` number, so any value should be passed as a plain 0-100 integer, not a pre-formatted percentage string.
- `quote` renders below the progress card inside the same bottom black-gradient overlay area, and appears even if `progressCard` is disabled.
- `socialProof.rating` is rendered by looping that many `Star` icons filled amber; there is no half-star support, so non-integer ratings will round down visually to the loop count.
- Despite `framer-motion` being listed as an npm dependency in the block's metadata, the component itself uses no Framer Motion: the only motion present is a CSS `transition-transform` hover-scale (`group-hover:scale-105`) on the portrait image.
