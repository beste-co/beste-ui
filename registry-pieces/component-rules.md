# Component Rules

Standards for components in `registry-components/`. Each component is a small,
self-contained asset designed to drop into block media slots — URL pills, status
indicators, mini cards, and so on.

---

## File structure

```
registry-components/{name}/
├── {name}.tsx       # component + demo export
└── {name}.meta.ts   # metadata for registry + browse UI
```

## Naming

- **Directory**: lowercase, no hyphen, `{category}{N}` — e.g. `browser1`, `progress2`, `socialproof1`.
- **Component export**: PascalCase matching the directory — `Browser1`, `Progress2`.
- **Demo export**: camelCase + `Demo` — `browser1Demo`.
- **Props interface**: PascalCase + `Props` — `Browser1Props`.
- **Variant enums**: lowercase semantic strings — `"primary" | "foreground" | "muted"`.

## Meta file

```ts
import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "browser1",           // must match directory
  title: "Browser URL Pill",  // 2–4 words, Title Case
  description: "…",            // 1–2 short sentences, varied per component
  category: "Browser",        // groups the browse UI
};
```

Keep descriptions short and varied in voice — avoid formulaic "A/An … with …"
openings across neighbouring components. No em dashes; prefer plain punctuation.

Add `registryDependencies: ["avatar"]` when a shadcn/ui primitive is imported.

## Component file

### Outer wrapper

Every component's root element is:

```tsx
<div
  className={cn(
    "relative flex size-full items-center justify-center p-4",
    className
  )}
>
  {/* component body */}
</div>
```

This fills block media slots while keeping the visual element centered.

### Styling rules

1. **No arbitrary Tailwind values.**
   - `text-[10px]` → `text-xs`
   - `max-w-[220px]` → `max-w-56`
   - `w-[1.5px]` → `w-0.5`
   - `h-8 w-8` → `size-8`
   - `h-full w-full` → `size-full`
   - If no token fits, introduce a discrete size prop instead of hardcoding.

2. **Only semantic color tokens.**
   - Use `bg-card`, `border-border`, `text-muted-foreground`, `text-primary`.
   - Palette colors are allowed when they carry semantic meaning: `emerald` for success, `rose` for error, `amber` for warning, `sky`/`indigo` for informational tints.
   - Never inline hex/rgb in component code — neither via class (`bg-[#...]`) nor `style`.

3. **No inline `style` for colors.**
   - Replace `style={{ backgroundColor: accentColor }}` with a discrete `tone` prop + `Record<Tone, string>` class map.
   - Inline `style` is only acceptable for truly dynamic values (percent widths,
     animation delays, SVG sizes computed from props).

4. **Solid over gradient by default.** A plain `bg-primary` or `bg-emerald-500`
   usually looks cleaner than `bg-gradient-to-br from-* to-*`. Reach for a
   gradient only when the component is intentionally expressive (vinyl label,
   orb, milestone hero). `primary`, `foreground`, and `neutral` tones are always solid.

5. **No opacity on card-level backgrounds.** The root surface of a component
   must use a solid token — `bg-card`, `bg-background`, `bg-primary`,
   `bg-emerald-500`, `bg-gradient-to-br from-sky-500 to-indigo-500`, etc.
   - ✘ `bg-emerald-500/5`, `bg-emerald-500/15`, `bg-sky-500/10`
   - ✘ `bg-gradient-to-br from-sky-500/10 via-indigo-500/5 to-transparent`
   - ✓ Solid fills, with borders carrying the tint instead: `border border-emerald-500 bg-card`
   - Inner accents (progress tracks, subtle rings, chip backgrounds) may still
     use `bg-current/10`, `bg-current/20`, `bg-muted`, or semantic tints —
     the restriction is only on the outermost card surface.

6. **No decorative left borders (`border-l-*`).** Accent strips along the left
   edge of cards, quote blocks, list rows, or diff lines are banned. They age
   poorly against theme changes, crowd the content, and create uneven alignment
   when the caller nests the component.
   - ✘ `border-l-4 border-amber-500 bg-muted/40`
   - ✘ `rounded-md border-l-2 border-sky-500 pl-2` inside a list row
   - ✓ Use a solid tinted bg, a colored dot, or a status pill for the same
     semantic hint without the left-edge stripe.

7. **Decorative elements get `aria-hidden`** — pulse spans, ping rings, status dots, connector lines, and icons that don't convey information.

### Props

```ts
interface Browser1Props {
  url?: string;
  tone?: Tone;
  className?: string;
}
```

- All props optional, each with a sensible default.
- `className` is always the last prop and merged via `cn()`.
- Prefer discrete union types over free strings for variants.
- Never accept raw colors (`#rrggbb`, `rgb(...)`) as props — accept a tone/variant enum instead.

## Tone pattern

Tones expose a live **Tone** picker in the showcase (top-right of the CLI/Code
tab bar). Users can preview any tone option without editing code.

### When to add a tone

Add a `tone` prop only when the component has a **single configurable accent**
the caller is likely to want to rebrand:

- Icon tiles, gradient badges, accent strips, progress fills, play buttons.

Skip the `tone` prop when the coloring is semantic and fixed:

- Status variants (`live/beta/paused/offline`), severities (`error/warning/info`), HTTP methods (`GET/POST/...`), presence (`online/away/offline`), review stars, traffic-light dots, theme-locked editor chrome (terminal greens, REC red).

### Tone enum rules

- The type **must** be named exactly `Tone`. The generator scans for
  `type Tone = "..." | "..."` and surfaces the options as a live picker.
- The enum **must** include `"primary"` and `"foreground"` as options, in that
  order relative to each other. These are the theme-aware fallbacks any theme
  can rely on.
- `"neutral"` is the preferred name for a tone whose classes are
  `border border-border bg-background text-foreground` (or
  `bg-card text-card-foreground`). Use it when the card should look like a
  plain theme surface with no colored accent. Never call this `"default"` or
  `"primary"` — list `"neutral"` first, then `"primary"`, `"foreground"`, then
  the colored options.
- The rest of the list can be whatever palette the component calls for
  (`sunset`, `ocean`, `emerald`, `violet`, `sky`, `amber`, `rose`, etc.).
- Prefer solid palette fills (`bg-emerald-500`) for each option. Gradients are
  allowed for intentionally-expressive tones only.
- When a tone drives the card body across all options (colored gradients and
  `neutral` alike), use `bg-current/10`, `bg-current/20`, `bg-current` and
  `opacity-80` on inner elements so they adapt to whichever tone is active —
  do not hardcode `bg-white/*` overlays.

### Class maps

```tsx
type Tone = "primary" | "foreground" | "emerald" | "sunset";

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  emerald: "bg-emerald-500 text-white",
  sunset: "bg-gradient-to-br from-rose-500 to-orange-500 text-white",
};

// In JSX:
<div className={cn("rounded-lg p-2", toneClasses[tone])} />
```

If tone affects more than one surface (e.g. an icon tile + a progress bar),
split into two maps (`tileClasses`, `barClasses`) keyed by the same `Tone`.

For SVG strokes, put `text-*` on the SVG root + `stroke="currentColor"` on
shapes.

### Per-item tones

If tones belong to sub-items (chart slices, bar segments), rename the type so
the top-level picker does **not** appear:

- `SliceTone` for chart slices
- `SegmentTone` for stacked-bar segments

The generator only picks up the exact name `Tone`.

### Tone default

- Function default and demo default should match.
- Pick a default that looks interesting in the preview (`sunset`, `emerald`,
  `ocean` are good demo defaults) — falling back to `primary` is fine when
  there is no strong visual identity.

## Demo export

- Realistic but generic content — no real customer PII.
- Shows off the component's capabilities (populate optional props where useful).
- Placed directly before the component function, not at the bottom.

```tsx
export const browser1Demo: Browser1Props = {
  url: "https://stripe.com",
  tone: "muted",
};
```

## Pre-ship checklist

- [ ] Directory name = meta.name = both file prefixes
- [ ] Component export PascalCase, demo export camelCase + `Demo`
- [ ] Outer wrapper pattern used exactly
- [ ] No `[...]` arbitrary Tailwind values
- [ ] No hex/rgb/inline color `style`
- [ ] No opacity on card-level backgrounds (`bg-emerald-500/5`, gradient-to-transparent, etc.)
- [ ] No `border-l-*` accent stripes on any surface, card or inner
- [ ] Decorative elements marked `aria-hidden`
- [ ] `className` last prop, merged via `cn()`
- [ ] Variants modeled as discrete unions, not open strings
- [ ] If `Tone` exists, it starts with `"primary" | "foreground"`
- [ ] Per-item tones use `SliceTone` / `SegmentTone` (not `Tone`)
- [ ] `registryDependencies` set when importing shadcn primitives
- [ ] Meta title, description, and category filled in
- [ ] Description reads naturally — not formulaic, no em dashes

## Generator

After adding or renaming a component, run:

```
bun run components:generate
```

This rebuilds `lib/components.ts` from the `.meta.ts` files so the browse
page, detail page, `/component/r/[name]` CLI endpoint, and the showcase tone
picker all see the new entry.
