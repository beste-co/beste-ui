# Feature9: Three-Step How-To

Centered header above three side-by-side step cards, each with its media surface pinned to the bottom of the card so uneven copy lengths still align the media row across all three cards. Each step's media slot follows the Media Slot Standard.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature9"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature9"
```

This installs the block to `components/beste/block/feature9.tsx`, the shadcn/ui `badge` component it depends on, and the `calendar1`, `terminal2`, and `upload1` pieces it embeds as media-slot fillers (installed to `components/beste/piece/{name}.tsx`).

## Quick start

The installed file exports `feature9Demo` alongside the block: the exact props behind the preview above. Spread it to get a working three-step section in one line.

```tsx
import { Feature9, feature9Demo } from "@/components/beste/block/feature9";

export default function Page() {
  return <Feature9 {...feature9Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup mixing an image card and a live-asset card looks like this:

```tsx
import { Terminal2 } from "@/components/beste/piece/terminal2";
import { Feature9 } from "@/components/beste/block/feature9";

export default function Page() {
  return (
    <Feature9
      badge={{ label: "How it works", variant: "outline" }}
      heading="Ship your next release in three steps"
      description="Each step shows the surface you'll actually touch."
      cards={[
        {
          title: "Review the design",
          description: "A screenshot of the finished mockup handed off to engineering.",
          media: {
            type: "image",
            src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=900&fit=crop",
            alt: "Code on screen",
          },
        },
        {
          title: "Ship the change",
          description: "One copy-and-paste command pushes the release.",
          media: { type: "component", component: <Terminal2 command="pnpm dlx shadcn@latest add feature9" /> },
        },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Badge above the heading |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `cards` | `StepCard[]` | `[]` | Step cards, rendered side by side |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type StepCard = {
  title: string;
  description: string;
  media: StepMedia;
};

type StepMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; alt?: string }
  | {
      type: "component";
      component: React.ReactNode;
      background?: ComponentBackground;
    };

type ComponentBackground =
  | { type: "dots" }
  | { type: "none" }
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; alt?: string };
```

## Behavior notes

- Cards lay out `md:flex-row` (column on mobile) and cap at `md:w-[350px]`; each card's media is pushed to the bottom via `mt-auto pt-4`, so the three cards' media rows stay aligned even when the title/description text runs to different lengths.
- The second demo card ("Plan the release window") sets `background: { type: "none" }` on its `component` media, opting out of the dotted-grid default so the embedded `Calendar1` piece sits directly on the card's own surface, the only demo item in this batch that uses the `none` background variant.
- The media surface itself uses `bg-card` (matching the card's own background), not the `bg-muted/30` panel used in `feature1`/`feature2`/`feature8`, so the media area blends into the card instead of reading as a distinct tinted panel.
- There is no `buttons`/CTA prop on this block at all; it stops at badge, heading, description, and the three step cards.
