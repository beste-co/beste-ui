# Onboarding9: Step Cards with Numbered Indicators

Multi-step onboarding wizard with square numbered/checkmark step indicators above a single content card that swaps title and description per step, driven by internal Back/Next/Finish navigation.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/onboarding9"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/onboarding9"
```

This installs the block to `components/beste/block/onboarding9.tsx` and the `badge` and `button` shadcn/ui primitives it depends on.

## Quick start

The installed file exports `onboarding9Demo` alongside the block: the exact props behind the preview above. Spread it to get a working step wizard in one line.

```tsx
import { Onboarding9, onboarding9Demo } from "@/components/beste/block/onboarding9";

export default function OnboardingPage() {
  return <Onboarding9 {...onboarding9Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Onboarding9 } from "@/components/beste/block/onboarding9";

export default function OnboardingPage() {
  return (
    <Onboarding9
      badge={{ label: "Quick Setup", variant: "secondary" }}
      heading="Get started in minutes"
      steps={[
        { id: "1", title: "Welcome aboard!", description: "Let's set up your account." },
        { id: "2", title: "Connect your tools", description: "Link the services you use daily." },
        { id: "3", title: "You're all set!", description: "Start exploring your workspace." },
      ]}
      labels={{ next: "Continue", back: "Back", finish: "Get Started" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Small badge above the heading |
| `heading` | `string` | – | Main headline |
| `steps` | `Step[]` | `[]` | Ordered wizard steps |
| `currentStep` | `number` | `0` | Seeds the initial step only; see Behavior notes |
| `labels` | `{ next?: string; back?: string; finish?: string }` | `{}` | Button labels for navigation |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type Step = {
  id: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
};
```

## Behavior notes

- `currentStep` only seeds the internal `useState` on first render (`useState(initialStep)`); after mount, navigation is entirely internal via the Back/Next/Finish buttons, so changing the `currentStep` prop later does not move the wizard (there's no effect syncing it).
- `steps[].icon` is typed as a `LucideIcon` but is never rendered by the component: only `title` and `description` show inside the content card, so the icon field is currently inert.
- Clicking "Finish" on the last step only calls `console.log("Onboarding completed!")`; there is no `onComplete` callback prop, so consumers can't hook into completion without editing the component.
- If `steps` is empty the component returns `null`, so it renders nothing rather than an empty shell.
- The step indicator squares show a checkmark for completed steps, scale up (`scale-110`) for the current step, and use a muted border otherwise; the Back button is hidden entirely on the first step rather than shown disabled.
