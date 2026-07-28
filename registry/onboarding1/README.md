# Onboarding1: Welcome Hero with Step Indicator

Centered onboarding hero that pairs a step counter, badge, heading, and hero image with up to two CTAs. `currentStep` and `totalSteps` are plain display numbers rendered through a "Step {current} of {total}" label template, not a stateful wizard, so the block never manages step transitions on its own.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/onboarding1"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/onboarding1"
```

This installs the block to `components/beste/block/onboarding1.tsx` and the `badge` and `button` shadcn/ui primitives it depends on.

## Quick start

The installed file exports `onboarding1Demo` alongside the block: the exact props behind the preview above. Spread it to get a working welcome screen in one line.

```tsx
import { Onboarding1, onboarding1Demo } from "@/components/beste/block/onboarding1";

export default function OnboardingPage() {
  return <Onboarding1 {...onboarding1Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Onboarding1 } from "@/components/beste/block/onboarding1";

export default function OnboardingPage() {
  return (
    <Onboarding1
      badge="Welcome"
      heading="Set up your workspace"
      description="A few quick steps and you're ready to go."
      image={{
        src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&h=675&fit=crop",
        alt: "Team workspace",
      }}
      currentStep={2}
      totalSteps={5}
      buttons={[
        { label: "Continue", href: "/setup/step-2" },
        { label: "Skip for now", href: "/dashboard", variant: "ghost" },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `string` | – | Small outline badge above the step text |
| `heading` | `string` | – | Main headline |
| `description` | `string` | – | Supporting copy below the heading |
| `image` | `{ src: string; alt: string }` | – | Hero image shown in a bordered aspect-video box |
| `currentStep` | `number` | `1` | Current step number, used only to fill the step-of label |
| `totalSteps` | `number` | `4` | Total step count, used only to fill the step-of label |
| `buttons` | `ButtonConfig[]` | `[]` | CTA row below the image |
| `labels` | `{ stepOf?: string }` | `{}` | Template string for the step counter |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ButtonConfig = {
  label: string;
  href: string;
  variant?: "default" | "ghost" | "outline";
};
```

## Behavior notes

- `currentStep`/`totalSteps` only feed the "Step {current} of {total}" text via a `.replace("{current}", ...)`/`.replace("{total}", ...)` call on `labels.stepOf`; there is no internal step state and no forward/back controls, so the block is a static display, not a wizard.
- `labels` is merged with the demo module's own `labels` object (`{ ...onboarding1Demo.labels, ...labels }`) before rendering, so passing a partial `labels` prop still falls back to the demo's own "Step {current} of {total}" wording rather than a hardcoded default in the component body.
- Only the first button (index `0`) gets a trailing `ArrowRight` icon; every other button renders as plain text, so the primary CTA should be listed first in `buttons`.
- The hero `image` renders in a fixed aspect-video box below the description; it's entirely optional and the layout collapses cleanly to the CTAs when omitted.
