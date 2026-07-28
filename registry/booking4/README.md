# Booking4: Service Selector

Step-one service picker for a booking flow: a pill-style category filter narrows a scrollable list of service rows, each showing an icon, name, optional badge, duration, and price, with a sticky footer summarizing the current pick and a "Next Step" button.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/booking4"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/booking4"
```

This installs the block to `components/beste/block/booking4.tsx`, plus the `badge` and `button` shadcn/ui primitives it uses for the service badges and footer button.

## Quick start

The installed file exports `booking4Demo` alongside the block: the exact props behind the preview above. Spread it to get a working service selector in one line.

```tsx
import { Booking4, booking4Demo } from "@/components/beste/block/booking4";

export default function BookingStep1Page() {
  return <Booking4 {...booking4Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Hand, Scissors, Sparkles } from "lucide-react";
import { Booking4 } from "@/components/beste/block/booking4";

export default function BookingStep1Page() {
  return (
    <Booking4
      badge={{ label: "Step 1 of 3", variant: "secondary" }}
      heading="Choose your <strong>service</strong>"
      description="Pick the treatment that suits you best."
      services={[
        {
          name: "Swedish Massage",
          description: "Gentle full-body massage for relaxation",
          duration: "60 min",
          price: "$89",
          category: "Massage",
          icon: Hand,
          badge: "Popular",
        },
        {
          name: "Hot Stone Therapy",
          description: "Heated stones for deep relaxation",
          duration: "75 min",
          price: "$140",
          category: "Massage",
          icon: Sparkles,
        },
        {
          name: "Haircut & Styling",
          description: "Precision cut with wash and blow-dry",
          duration: "45 min",
          price: "$65",
          category: "Hair",
          icon: Scissors,
        },
      ]}
      labels={{ allCategory: "All", noSelection: "No service selected", nextButton: "Next Step" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Section eyebrow badge |
| `heading` | `string` | – | Section heading, supports inline `<strong>` |
| `description` | `string` | – | Section intro text |
| `services` | `Service[]` | `[]` | Rows rendered in the scrollable list |
| `labels` | `Booking4Labels` | `{}` | UI copy: category filter label, empty-state text, footer button text |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type Service = {
  name: string;
  description: string;
  duration: string;
  price: string;
  category: string;
  icon: LucideIcon;
  badge?: string;
};

type Booking4Labels = {
  allCategory?: string;
  noSelection?: string;
  nextButton?: string;
};
```

## Behavior notes

- Category tabs are custom buttons, not the shadcn `Tabs` component. They're built from `[allCategory, ...new Set(services.map(s => s.category))]` and only render when there are more than two categories in that list (in effect, more than one real category besides "All").
- Selection is tracked by matching `service.name` as a string key, not an index or id, so two services sharing the same name would both be treated as selected together.
- `heading` supports inline `<strong>` markup rendered via `dangerouslySetInnerHTML` (the demo uses `"Choose your <strong>service</strong>"`).
- The "Next Step" button is disabled until a service is selected. Clicking it only calls `console.log("Selected service:", selected)`, it does not navigate or submit anywhere, so wiring an actual next step is left to the integrator.
- The service list scrolls internally once its content exceeds `max-h-[480px]`, keeping the category tabs and the footer summary always in view.
