# Onboarding3: Minimal Welcome with Icon

Narrow, centered welcome card built around a single icon tile, heading, description, and one primary CTA. `icon` accepts any `ReactNode` and falls back to a `Boxes` lucide icon inside a rounded `primary/10` tile when omitted.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/onboarding3"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/onboarding3"
```

This installs the block to `components/beste/block/onboarding3.tsx` and the `button` shadcn/ui primitive it depends on.

## Quick start

The installed file exports `onboarding3Demo` alongside the block: the exact props behind the preview above. Spread it to get a working welcome screen in one line.

```tsx
import { Onboarding3, onboarding3Demo } from "@/components/beste/block/onboarding3";

export default function OnboardingPage() {
  return <Onboarding3 {...onboarding3Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Onboarding3 } from "@/components/beste/block/onboarding3";

export default function OnboardingPage() {
  return (
    <Onboarding3
      heading="Welcome to your workspace"
      description="Everything is set up. Let's take a quick look around."
      primaryButton={{ label: "Start the tour", href: "/tour" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `React.ReactNode` | – | Icon rendered in the rounded tile; falls back to a `Boxes` icon |
| `heading` | `string` | – | Main headline |
| `description` | `string` | – | Supporting copy below the heading |
| `primaryButton` | `{ label: string; href: string }` | – | Single CTA below the description |
| `className` | `string` | – | Extra classes for the outer `<section>` |

## Behavior notes

- `icon` has no default in the type, but the component substitutes a `Boxes` lucide icon (`icon ?? <Boxes className="size-8 text-primary" />`) whenever the prop is not supplied, so a custom icon fully replaces the default rather than layering on top of it.
- The content column is capped at `max-w-md`, noticeably narrower than most onboarding blocks in this set (`onboarding1` uses `max-w-4xl`), which keeps the card reading like a modal even though it renders as a full-width section.
- Only one CTA slot exists (`primaryButton`); there's no secondary or skip button prop, unlike `onboarding1` and `onboarding4`.
