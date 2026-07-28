# Hero68: Centered Hero with Feature Icons

Centered hero with a headline, CTA buttons, and a row of icon-led feature cards beneath them, each card mapping to one of three built-in Lucide icons. Built for platform and infrastructure products that want a quick three-point pitch under the fold.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/hero68"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/hero68"
```

This installs the block to `components/beste/block/hero68.tsx` and the shadcn/ui `badge` and `button` components it depends on.

## Quick start

The installed file exports `hero68Demo` alongside the block: the exact props behind the preview above. Spread it to get a working hero in one line.

```tsx
import { Hero68, hero68Demo } from "@/components/beste/block/hero68";

export default function Page() {
  return <Hero68 {...hero68Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Hero68 } from "@/components/beste/block/hero68";

export default function Page() {
  return (
    <Hero68
      badge={{ label: "Infrastructure", variant: "outline" }}
      heading="Ship infrastructure that scales itself"
      description="Provision, deploy, and monitor from a single dashboard built for growing teams."
      buttons={[{ label: "Start Building", href: "/signup" }]}
      features={[
        { icon: "zap", title: "Lightning Fast", description: "Global edge deploys in seconds" },
        { icon: "lock", title: "Secure by Default", description: "Zero-config encryption and audits" },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Badge above the heading |
| `heading` | `string` | – | Main headline |
| `description` | `string` | – | Supporting paragraph |
| `buttons` | `ButtonItem[]` | `[]` | CTA buttons below the description |
| `features` | `FeatureCard[]` | `[]` | Icon cards row below the CTA buttons |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type ButtonItem = {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
};

type FeatureCard = {
  icon: "layers" | "lock" | "zap";
  title: string;
  description: string;
};
```

## Behavior notes

- `icon` is a closed three-value enum mapped to Lucide icons through an internal `iconMap` (`layers`, `lock`, `zap`). There is no fallback icon, so any other string would resolve to `undefined` and fail to render.
- Feature cards use a `flex-wrap` row capped at `max-w-3xl` rather than a CSS grid, so with the demo's 3 items they sit on one line at `md` and stack on mobile; extra items simply wrap onto additional rows.
- Only the first button (index 0) gets an ArrowRight icon.
- The heading scales up to `lg:text-6xl`, one step larger than the `md:text-5xl` cap used in most other heroes in this registry.
