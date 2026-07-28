# Booking5: Provider Picker

Step-two staff picker for a booking flow: provider cards show an avatar with a same-day availability dot, a star rating with review count, years of experience, and the next available slot, with an optional "Any Available Provider" row pinned above the list.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/booking5"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/booking5"
```

This installs the block to `components/beste/block/booking5.tsx`, plus the `badge`, `button`, and `avatar` shadcn/ui primitives it uses for the availability badge, footer button, and provider avatars.

## Quick start

The installed file exports `booking5Demo` alongside the block: the exact props behind the preview above. Spread it to get a working provider picker in one line.

```tsx
import { Booking5, booking5Demo } from "@/components/beste/block/booking5";

export default function BookingStep2Page() {
  return <Booking5 {...booking5Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Booking5 } from "@/components/beste/block/booking5";

export default function BookingStep2Page() {
  return (
    <Booking5
      badge={{ label: "Step 2 of 3", variant: "secondary" }}
      heading="Choose your <strong>specialist</strong>"
      description="Pick a provider for your appointment."
      allowAny
      providers={[
        {
          name: "Dr. Emily Carter",
          specialty: "Sports & Deep Tissue",
          rating: 4.9,
          reviews: 127,
          experience: "8 years",
          availability: "Next: Today, 2:00 PM",
          availableToday: true,
        },
        {
          name: "Marcus Chen",
          specialty: "Therapeutic & Recovery",
          rating: 4.8,
          reviews: 94,
          experience: "12 years",
          availability: "Next: Tomorrow, 10:00 AM",
        },
      ]}
      labels={{
        anyProviderTitle: "Any Available Provider",
        anyProviderDescription: "We'll match you with the next available specialist",
        availableTodayBadge: "Today",
        noSelection: "No provider selected",
        anyProviderSummary: "Any Provider",
        nextButton: "Next Step",
      }}
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
| `providers` | `ProviderInfo[]` | `[]` | Provider rows rendered below the optional "Any" row |
| `allowAny` | `boolean` | `false` | Shows the "Any Available Provider" row above the list |
| `labels` | `Booking5Labels` | `{}` | UI copy: "Any" row text, badge text, empty-state and footer text |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ProviderInfo = {
  name: string;
  specialty: string;
  avatar?: string;
  rating: number;
  reviews: number;
  experience: string;
  availability: string;
  availableToday?: boolean;
};

type Booking5Labels = {
  anyProviderTitle?: string;
  anyProviderDescription?: string;
  availableTodayBadge?: string;
  noSelection?: string;
  anyProviderSummary?: string;
  nextButton?: string;
};
```

## Behavior notes

- The "Any Available Provider" row only renders when `allowAny` is true, and always sits first in the list with a shuffle icon in place of an avatar.
- Selection is tracked by matching `provider.name` (or the literal string `"any"`), not an index, so provider names must be unique within one instance for selection state to behave correctly.
- `availableToday` drives two independent visuals: a small emerald dot on the avatar's corner, and an emerald-tinted "Today" badge next to the name (from `labels.availableTodayBadge`); both are skipped entirely when the flag is false.
- The footer confirm button's `onClick` only calls `console.log` with the resolved provider (or `"any available"`). No network request or navigation happens, real submission logic is left to the integrator.
- `heading` supports inline `<strong>` markup via `dangerouslySetInnerHTML`, matching the pattern used across the booking blocks in this set.
