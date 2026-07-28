# Feature22: Setup Checklist with Progress Sidebar

Two-column onboarding layout: a list of status-tagged setup steps on the left (each optionally a link, with an ETA and a done/in-progress/todo pill), and a sticky sidebar on the right showing a computed completion percentage, a progress bar, key stats, and CTA buttons.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/feature22"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/feature22"
```

This installs the block to `components/beste/block/feature22.tsx` and the shadcn/ui `badge`, `button`, and `progress` components it depends on.

## Quick start

The installed file exports `feature22Demo` alongside the block: the exact props behind the preview above. Spread it to get a working checklist in one line.

```tsx
import { Feature22, feature22Demo } from "@/components/beste/block/feature22";

export default function Page() {
  return <Feature22 {...feature22Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Plug, ShieldCheck, Wand2 } from "lucide-react";
import { Feature22 } from "@/components/beste/block/feature22";

export default function Page() {
  return (
    <Feature22
      badge={{ label: "Setup", variant: "secondary" }}
      heading="Launch-ready in a single afternoon"
      description="Configure essentials, validate data, and go live with confidence."
      steps={[
        {
          id: "step-1",
          icon: <Plug className="size-6 md:size-8" />,
          title: "Connect your data sources",
          eta: "5-10 min",
          status: "done",
          href: "/setup/connect",
        },
        {
          id: "step-2",
          icon: <ShieldCheck className="size-6 md:size-8" />,
          title: "Configure roles & access",
          eta: "10-15 min",
          status: "in_progress",
        },
        {
          id: "step-3",
          icon: <Wand2 className="size-6 md:size-8" />,
          title: "Apply templates & standards",
          eta: "15-25 min",
          status: "todo",
        },
      ]}
      stats={[{ id: "stat-1", label: "Avg. time to first publish", value: "45 min" }]}
      buttons={[{ id: "btn-1", label: "Start a guided setup", href: "/setup" }]}
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
| `progressLabel` | `string` | `"Progress"` | Label above the sidebar's percentage readout |
| `stepsCompletedLabel` | `string` | `"steps completed"` | Suffix after the `done/total` count in the sidebar |
| `steps` | `Step[]` | `[]` | Checklist rows on the left |
| `stats` | `Stat[]` | `[]` | Key-number rows inside the sidebar |
| `buttons` | `ButtonItem[]` | `[]` | CTA buttons at the bottom of the sidebar |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type StepStatus = "done" | "in_progress" | "todo";

type Step = {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  eta?: string;
  status?: StepStatus;
  href?: string;
};

type Stat = {
  id: string;
  label: string;
  value: string;
  description?: string;
};

type ButtonItem = {
  id: string;
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
};
```

## Behavior notes

- The component returns `null` when `steps` is empty (`if (steps.length === 0) return null;`), so an empty checklist renders nothing at all rather than an empty section shell, unlike the other blocks in this batch.
- Completion percentage is computed with `useMemo`, counting steps whose `status` is `"done"` against `steps.length`; the same `progressPercent` value drives both the sidebar's numeric readout and the `Progress` bar.
- A step with `href` set renders as a full-width `Link` wrapping the whole card (`hover:opacity-80` on hover); a step without `href` renders as a plain, non-interactive `div` with identical markup otherwise.
- The sidebar is `lg:sticky lg:top-6`, so it stays pinned in view while the step list scrolls past it on large screens; below `lg` the layout drops to a single column (the `lg:grid-cols-[1.35fr_0.65fr]` split only applies at `lg` and up) and the sidebar simply stacks after the steps.
- `icon` is typed as `React.ReactNode`, a pre-rendered element such as `<Plug className="size-6 md:size-8" />`, rather than the `LucideIcon` component-reference pattern (`icon?: LucideIcon`) used by the other blocks in this batch, so callers size and style the icon themselves before passing it in.
