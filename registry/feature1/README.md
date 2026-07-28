# Feature1: Accordion With Live Media

Two-column feature section: a single-open shadcn Accordion of capability rows on the left, and a media surface on the right that swaps to show whichever row is currently expanded. Each row's media slot follows the Media Slot Standard, so it can hold a static image, a looping video, or a live registry-piece asset rendered inline.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature1"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature1"
```

This installs the block to `components/beste/block/feature1.tsx`, the shadcn/ui `accordion` and `badge` components it depends on, and the `ai43`, `automation1`, `automation2`, `automation8`, and `automation10` pieces it embeds as media-slot fillers (installed to `components/beste/piece/{name}.tsx`).

## Quick start

The installed file exports `feature1Demo` alongside the block: the exact props behind the preview above. Spread it to get a working accordion-with-media section in one line.

```tsx
import { Feature1, feature1Demo } from "@/components/beste/block/feature1";

export default function Page() {
  return <Feature1 {...feature1Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup mixing an image row and a live-asset row looks like this:

```tsx
import { Automation1 } from "@/components/beste/piece/automation1";
import { Feature1 } from "@/components/beste/block/feature1";

export default function Page() {
  return (
    <Feature1
      badge={{ label: "Automations", variant: "secondary" }}
      heading="Pick a capability, see the surface"
      description="Open any row to expand its story."
      features={[
        {
          title: "See the finished layout",
          description: "A static preview of the dashboard your team ships to.",
          media: {
            type: "image",
            src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=900&fit=crop",
            alt: "Analytics dashboard on a laptop",
          },
        },
        {
          title: "Trigger meets action, in one tile",
          description: "Two apps, two events, an arrow tells the story.",
          media: {
            type: "component",
            component: (
              <Automation1
                trigger={{ src: "https://oud.pics/sm/l/stripe.jpeg", alt: "Stripe", event: "Payment received" }}
                action={{ src: "https://oud.pics/sm/l/slack.svg", alt: "Slack", event: "Send #revenue alert" }}
              />
            ),
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
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Badge above the heading |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `features` | `FeatureItem[]` | `[]` | Accordion rows; each pairs a title/description with a media slot |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type FeatureItem = {
  title: string;
  description: string;
  media: FeatureMedia;
};

type FeatureMedia =
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

- The Accordion opens `item-0` by default and local `activeIndex` state starts at `0`, so the first row and its media are visible before any interaction.
- `onValueChange` parses the numeric index out of the accordion's `item-N` value string to update `activeIndex`. Collapsing the open item drives `value` to an empty string, which the handler's `if (!value) return;` guard ignores, so the right-side media keeps showing the last opened row instead of clearing when a row is collapsed.
- The right-column media surface is `hidden md:block`. Below `md`, each row instead renders its own copy of the media inline inside its `AccordionContent` (`mt-4 md:hidden`), so the same media element has two separate render paths depending on breakpoint.
- All five demo rows use the `component` media variant to embed automation and AI pieces; the `image`/`video` variants are supported by the `FeatureMedia` type but not exercised by the shipped demo data.
