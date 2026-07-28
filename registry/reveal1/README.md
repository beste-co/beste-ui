# Reveal1: Before/After Image Slider

Draggable before/after image comparison slider: pointer and touch drag move a clip-path divider between two full-bleed images, with an accessible slider role and optional Before/After pill labels.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/reveal1"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/reveal1"
```

This installs the block to `components/beste/block/reveal1.tsx` and its dependencies.

## Quick start

The installed file exports `reveal1Demo` alongside the block: the exact props behind the preview above. Spread it to get a working comparison slider in one line.

```tsx
import { Reveal1, reveal1Demo } from "@/components/beste/block/reveal1";

export default function ShowcasePage() {
  return <Reveal1 {...reveal1Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Reveal1 } from "@/components/beste/block/reveal1";

export default function ShowcasePage() {
  return (
    <Reveal1
      heading="Before and after"
      description="Drag the handle to compare the two states."
      beforeImage={{
        src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=675&fit=crop&sat=-100",
        alt: "Before",
      }}
      afterImage={{
        src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=675&fit=crop",
        alt: "After",
      }}
      orientation="horizontal"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `string` | – | Optional heading above the slider |
| `description` | `string` | – | Optional supporting copy above the slider |
| `beforeImage` | `{ src: string; alt: string }` | – | Required. Image clipped by the divider |
| `afterImage` | `{ src: string; alt: string }` | – | Required. Full-bleed background image |
| `beforeLabel` | `string` | `"Before"` | Pill label over `beforeImage` |
| `afterLabel` | `string` | `"After"` | Pill label over `afterImage` |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Drag axis and divider orientation |
| `initialPosition` | `number` | `50` | Starting divider position, 0-100 |
| `showLabels` | `boolean` | `true` | Toggles the Before/After pill labels |
| `dividerWidth` | `number` | `4` | Divider bar thickness in pixels |
| `className` | `string` | – | Extra classes for the outer `<section>` |

## Behavior notes

- Dragging is driven by raw pointer math, not a scroll or `IntersectionObserver` reveal: `mousedown`/`touchstart` on the container starts a drag, and while dragging, `mousemove`/`touchmove`/`mouseup`/`touchend` listeners are attached to `document` (not the container), so the drag continues even if the pointer leaves the slider bounds.
- The divider position is applied to the "before" image via a CSS `clipPath: inset(...)` on an absolutely positioned wrapper, so both images are always fully painted in the DOM and only the clip rectangle changes as `position` updates.
- `orientation` flips both the clip axis and the divider handle icon (`GripVertical` for horizontal dragging, `GripHorizontal` for vertical); in vertical mode the "after" label moves from top-right to bottom-left so it never collides with the "before" label.
- The container carries `role="slider"` with `aria-valuemin`/`aria-valuemax`/`aria-valuenow` reflecting `position`, but there's no keyboard handler, so arrow-key input isn't wired up despite the ARIA role.
- `beforeImage` and `afterImage` are required props with no default, unlike `reveal2` where the same fields are optional and fall back to a placeholder.
