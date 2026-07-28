# UseCase5: Feature Icon Grid

Minimal centered icon grid for listing product features or capabilities: each cell is just an icon swatch, a title, and a one-line description, with no image, border, or feature list weighing it down.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/usecase5"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/usecase5"
```

This installs the block to `components/beste/block/usecase5.tsx` and the `badge` shadcn/ui primitive it depends on.

## Quick start

The installed file exports `usecase5Demo` alongside the block: the exact props behind the preview above. Spread it to get a working section in one line.

```tsx
import { UseCase5, usecase5Demo } from "@/components/beste/block/usecase5";

export default function Page() {
  return <UseCase5 {...usecase5Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { BarChart3, Shield, Users } from "lucide-react";
import { UseCase5 } from "@/components/beste/block/usecase5";

export default function Page() {
  return (
    <UseCase5
      badge={{ label: "Features", variant: "secondary" }}
      heading="Everything You Need"
      description="A toolkit designed to help you accomplish more with less effort."
      columns={3}
      items={[
        { id: "analytics", icon: <BarChart3 className="size-7" />, title: "Analytics", description: "Real-time dashboards and reports." },
        { id: "security", icon: <Shield className="size-7" />, title: "Security", description: "Encryption and access controls." },
        { id: "collaboration", icon: <Users className="size-7" />, title: "Collaboration", description: "Share and work together seamlessly." },
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
| `items` | `UseCaseItem[]` | – | Icon cells rendered in the grid |
| `columns` | `2 \| 3 \| 4` | `4` | Grid column count at `sm`/`lg` |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type UseCaseItem = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
};
```

## Behavior notes

- `columns` is looked up in a plain object map (`{2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4"}`), so passing any value outside `2 | 3 | 4` would produce `undefined` classes; the TypeScript union restricts callers to the three supported values.
- Each cell has a `hover:bg-foreground/[0.03]` wash across the whole cell, not just the icon, giving the grid a subtle full-tile hover affordance despite having no border.
- The icon swatch is a fixed `w-14 h-14 rounded-xl` regardless of the icon's own size prop (the demo passes `size-7` icons), and inverts colors on hover (`bg-primary/10` to `bg-primary`, icon color to `text-background`) via the `group/usecase5` named group.
- `icon` is a required field on `UseCaseItem` (not optional), unlike the other usecase blocks in this set where `icon` is optional.
