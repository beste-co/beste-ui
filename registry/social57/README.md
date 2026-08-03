# Social57: Community Photo Wall

A community gallery laid out as a masonry of customer photographs at mixed heights, each captioned with what is happening and the practice it came from.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/social57"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/social57"
```

This installs the block to `components/beste/block/social57.tsx` plus the `badge23` and `button21` components it uses for the eyebrow and the closing action.

## Quick start

The installed file exports `social57Demo` alongside the block: the exact props behind the preview above. Spread it to get a working gallery in one line.

```tsx
import { Social57, social57Demo } from "@/components/beste/block/social57";

export default function GalleryPage() {
  return <Social57 {...social57Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Social57 } from "@/components/beste/block/social57";

export default function GalleryPage() {
  return (
    <Social57
      badge={{ label: "In the wild" }}
      heading="Photographs from rooms we did not decorate"
      description="Sent in by practices, published with their permission."
      frames={[
        {
          src: "/wall/go-live.jpg",
          alt: "A clinician smiling in a bright clinic",
          caption: "Go-live morning, and nothing on fire",
          place: "Bramble Health, Bristol",
          tall: true,
        },
        {
          src: "/wall/handover.jpg",
          alt: "Two colleagues talking in a corridor",
          caption: "The handover that used to be a phone call",
          place: "Kingsway Clinic, Leeds",
        },
      ]}
      closing="Have one worth sending? We publish with a credit and never without asking."
      button={{ label: "Send us a photograph", href: "/contact" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string }` | – | Eyebrow above the hairline rule, rendered through `Badge23` |
| `heading` | `string` | – | Section heading in the left column of the header |
| `description` | `string` | – | Supporting paragraph, right-aligned from `md` up |
| `frames` | `Frame[]` | `[]` | Photographs with captions, laid out as a masonry |
| `closing` | `string` | – | Permission policy beside the closing action |
| `button` | `{ label: string; href: string }` | – | Outline submission action |
| `className` | `string` | – | Extra classes for the outer `section` |

```ts
type ActionLink = {
  label: string;
  href: string;
};

type Frame = {
  src: string;
  alt: string;
  caption: string;
  place: string;
  tall?: boolean;
};
```

## Behavior notes

- The layout is CSS multi-column (`columns-1 sm:columns-2 lg:columns-3`) rather than a grid, which is what lets frames of different heights pack without leaving gaps. Each figure carries `break-inside-avoid` so a photograph and its caption never split across a column.
- Because columns fill top to bottom rather than left to right, the reading order down the page is not the array order once the layout goes multi-column. Do not rely on the order for meaning.
- `tall` switches a frame from `h-64` to `h-96`. The demo balances three tall and three short frames, which is what keeps the three columns roughly level at the bottom.
- Six frames is the count the layout is tuned for: at `lg` that is exactly two per column.
- Frames are real `figure` and `figcaption` pairs, so captions stay associated with their images.
- `caption` and `place` are separate, so the caption can describe the moment while the credit stays factual. Both are required, since publishing a customer photograph without a credit is what the closing note promises not to do.
- Frames are not links. This is a wall rather than a directory.
