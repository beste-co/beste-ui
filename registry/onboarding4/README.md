# Onboarding4: Video Introduction Screen

Video-tour welcome screen: a badge, heading, and description sit above a video thumbnail with a play-button overlay and duration pill, followed by primary and secondary CTAs.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/onboarding4"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/onboarding4"
```

This installs the block to `components/beste/block/onboarding4.tsx` and the `badge` and `button` shadcn/ui primitives it depends on.

## Quick start

The installed file exports `onboarding4Demo` alongside the block: the exact props behind the preview above. Spread it to get a working intro screen in one line.

```tsx
import { Onboarding4, onboarding4Demo } from "@/components/beste/block/onboarding4";

export default function OnboardingPage() {
  return <Onboarding4 {...onboarding4Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Onboarding4 } from "@/components/beste/block/onboarding4";

export default function OnboardingPage() {
  return (
    <Onboarding4
      badge="Quick Tour"
      heading="See how it works"
      description="A short walkthrough of the core workflow."
      video={{
        thumbnailSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop",
        thumbnailAlt: "Product walkthrough thumbnail",
        duration: "1:48",
      }}
      primaryButton={{ label: "Watch Video", href: "/tour" }}
      secondaryButton={{ label: "Skip", href: "/dashboard" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `string` | – | Small outline badge above the heading |
| `heading` | `string` | – | Main headline |
| `description` | `string` | – | Supporting copy below the heading |
| `video` | `VideoInfo` | – | Thumbnail image, alt text, and optional duration pill |
| `primaryButton` | `{ label: string; href: string }` | – | Primary CTA, always shown with a leading `Play` icon |
| `secondaryButton` | `{ label: string; href: string }` | – | Secondary CTA, always shown with a leading `SkipForward` icon |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type VideoInfo = {
  thumbnailSrc: string;
  thumbnailAlt: string;
  duration?: string;
};
```

## Behavior notes

- The video thumbnail is presentational only: there's no `<video>` element or `onClick` handler wired to it, so the play button, duration badge, and hover zoom are visual affordance and the actual "watch" action happens through `primaryButton`'s `href`, not inline playback.
- Hovering the thumbnail scales the image (`scale-105`), darkens the overlay (`bg-black/30` to `bg-black/40`), and scales up the circular play icon (`scale-110`), all driven by a single `group`/`group-hover` pairing on the thumbnail wrapper.
- `video.duration` is optional; the black duration pill in the bottom-right corner only renders when it's set.
- `primaryButton` always renders with a leading `Play` icon and `secondaryButton` with a leading `SkipForward` icon; the icons are hardcoded to their slot and aren't configurable per button.
