# Feature28: Process Timeline with Duration Badges

Sequential step timeline that renders two completely different layouts by breakpoint: a horizontal row of numbered circles connected by a full-width line on desktop, and an indented vertical list connected by a side line on mobile. Each step can carry an icon, a description, and a small duration pill.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature28"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature28"
```

This installs the block to `components/beste/block/feature28.tsx` and the shadcn/ui `badge` and `button` components it depends on.

## Quick start

The installed file exports `feature28Demo` alongside the block: the exact props behind the preview above. Spread it to get a working timeline in one line.

```tsx
import { Feature28, feature28Demo } from "@/components/beste/block/feature28";

export default function Page() {
  return <Feature28 {...feature28Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Rocket, Settings, Check } from "lucide-react";
import { Feature28 } from "@/components/beste/block/feature28";

export default function Page() {
  return (
    <Feature28
      badge={{ label: "How it works", variant: "default" }}
      heading="From signup to success in 3 steps"
      description="A streamlined onboarding process that gets you up and running fast."
      steps={[
        {
          id: "step-1",
          icon: <Rocket className="size-5" />,
          title: "Create your account",
          description: "Sign up with email or SSO.",
          duration: "2 min",
        },
        {
          id: "step-2",
          icon: <Settings className="size-5" />,
          title: "Connect your tools",
          description: "Integrate with your existing stack.",
          duration: "5 min",
        },
        {
          id: "step-3",
          icon: <Check className="size-5" />,
          title: "Go live",
          description: "Deploy to production with one click.",
          duration: "1 min",
        },
      ]}
      buttons={[{ id: "btn-1", label: "Get started free", href: "/signup" }]}
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
| `steps` | `TimelineStep[]` | `[]` | Steps rendered in both the desktop and mobile timelines |
| `buttons` | `ButtonItem[]` | `[]` | CTA buttons below the timeline |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type TimelineStep = {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  duration?: string;
};

type ButtonItem = {
  id: string;
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
};
```

## Behavior notes

- Desktop and mobile timelines are two separate DOM trees (`hidden md:block` and `md:hidden`), both always rendered; the breakpoint only toggles visibility with CSS, not conditional mounting.
- The desktop grid column count is chosen from a fixed lookup on `steps.length`: 2/3/4 steps map to that many columns exactly, and 5 or more steps are capped at `grid-cols-5`, so six or more steps will wrap into a second row rather than adding a sixth column.
- On desktop, a step with no `icon` falls back to its 1-based index number inside the circle; on mobile, the fallback is a small filled dot (`Circle`) instead of a number, and a supplied icon is scaled down (`scale-60`) to fit the smaller mobile marker.
- The duration pill (a `Clock` icon plus the `duration` string) only renders when `duration` is set, on both breakpoints, and sits in different positions: centered below the title on desktop, right-aligned next to the step label on mobile.
- The desktop connector is a single absolutely positioned horizontal line behind the circles (`top-6`); the mobile connector is a vertical line to the left of the stacked cards, each with `bg-border` and no animation.
