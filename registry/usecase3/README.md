# UseCase3: Numbered Steps Process

Vertical process walkthrough where each step alternates its image between the left and right side of the row: a numbered badge, title, description, and feature checklist sit on one side while a bordered screenshot sits on the other.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/usecase3"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/usecase3"
```

This installs the block to `components/beste/block/usecase3.tsx` and the `badge` shadcn/ui primitive it depends on.

## Quick start

The installed file exports `usecase3Demo` alongside the block: the exact props behind the preview above. Spread it to get a working section in one line.

```tsx
import { UseCase3, usecase3Demo } from "@/components/beste/block/usecase3";

export default function Page() {
  return <UseCase3 {...usecase3Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { UseCase3 } from "@/components/beste/block/usecase3";

export default function Page() {
  return (
    <UseCase3
      badge={{ label: "How It Works", variant: "secondary" }}
      heading="Simple Steps to Success"
      description="Follow our proven process to reach your goals faster."
      steps={[
        {
          id: "step1",
          title: "Create Your Account",
          description: "Sign up in seconds with your email or social accounts.",
          image: { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71", alt: "Sign up screen" },
          features: [{ id: "f1", text: "No credit card required" }],
        },
        {
          id: "step2",
          title: "Configure Your Workspace",
          description: "Invite your team and connect the tools you already use.",
          image: { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f72", alt: "Configuration dashboard" },
          features: [{ id: "f2", text: "Role-based permissions" }],
        },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Pill shown above the heading; omitted when `badge.label` is falsy |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `steps` | `UseCaseStep[]` | – | Ordered process steps |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type UseCaseStep = {
  id: string;
  title: string;
  description: string;
  image?: { src: string; alt: string };
  features?: UseCaseFeature[];
};

type UseCaseFeature = { id: string; text: string };
```

## Behavior notes

- The step number shown in the round badge is derived from array position, not any field on `UseCaseStep`: `String(index + 1).padStart(2, "0")`, so it is always sequential regardless of `id`.
- Rows alternate sides purely by index parity: even-indexed steps (0, 2, ...) keep content on the left and image on the right; odd-indexed steps flip both with `md:order-1`/`md:order-2`. This only takes effect at `md` and above; on mobile every step stacks content above image.
- Every step gets `md:mb-16` spacing except the last one, so there is no trailing gap after the final step.
- The image side renders nothing (not even an empty frame) when `step.image` is omitted; the content side is unaffected either way.
