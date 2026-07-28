# Auth38: Pattern Lock Unlock

Full-height pattern-unlock screen: a heading and description above a tappable 3x3 dot grid that draws an SVG line connecting dots as they're selected, then an unlock button (enabled once enough dots are picked) and a clear button, with an optional forgot-pattern link underneath.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/auth38"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/auth38"
```

This installs the block to `components/beste/block/auth38.tsx` and the `button` shadcn/ui primitive it's built on.

## Quick start

The installed file exports `auth38Demo` alongside the block: the exact props behind the preview above. Spread it to get a working pattern-unlock screen in one line.

```tsx
import { Auth38, auth38Demo } from "@/components/beste/block/auth38";

export default function UnlockPage() {
  return <Auth38 {...auth38Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Auth38 } from "@/components/beste/block/auth38";

export default function UnlockPage() {
  return (
    <Auth38
      heading="Draw your pattern"
      description="Connect at least 4 dots to unlock your account."
      minLength={4}
      labels={{ clear: "Clear" }}
      unlockButton={{ label: "Unlock", href: "/dashboard" }}
      forgotPrompt={{ text: "Forgot your pattern?", linkLabel: "Reset it", href: "/reset-pattern" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `string` | – | Screen title |
| `description` | `string` | – | Subtext below the heading |
| `minLength` | `number` | `4` | Minimum number of connected dots required to enable the unlock button |
| `labels` | `{ clear?: string }` | `{}` | Clear button label |
| `unlockButton` | `{ label: string; href: string }` | – | Primary button, hidden entirely when not set |
| `forgotPrompt` | `{ text: string; linkLabel: string; href: string }` | – | Line below the buttons, hidden entirely when not set |
| `className` | `string` | – | Extra classes for the outer `<section>` |

## Behavior notes

- Dot selection happens through individual `onClick` handlers on each of the 9 dots, not pointer-drag tracing; despite the "draw your pattern" framing there is no `pointermove`/touch-drag listener, so a real drag-to-connect gesture is not implemented out of the box.
- `select()` ignores a dot that's already in the `selected` array, so dots can only be added once and never re-added or removed individually; the only way to deselect anything is the "Clear" button, which resets the whole pattern.
- The connecting line is an SVG `<polyline>` computed from `dotCenter()`, which maps each dot's index to fixed pixel coordinates on a `GRID = 3`, `STEP = 80` grid (a hardcoded 240x240px canvas), so the grid geometry is not responsive or prop-configurable.
- The unlock button only becomes a real `Link` (via `asChild`) once `selected.length >= minLength`; below that threshold it renders as a disabled plain button showing the same label but with no `href`, so it cannot navigate until the minimum pattern length is met.
- There is no `onChange`/`onComplete` callback prop exposing the selected dot sequence; `selected` is purely internal `useState<number[]>`, so an integrator needs to fork the component to read or persist the drawn pattern.
