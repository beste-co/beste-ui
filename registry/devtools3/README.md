# Devtools3: Multi-Language Code Tabs

Tabbed code snippet block for API "quick start" sections: a row of language tabs (JavaScript, Python, cURL, Go in the demo) above a Shiki-highlighted, always-dark code panel with a copy-to-clipboard button.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/devtools3"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/devtools3"
```

This installs the block to `components/beste/block/devtools3.tsx`, the `Button` shadcn/ui primitive it uses, and the `shiki` npm dependency it needs for syntax highlighting.

## Quick start

The installed file exports `devtools3Demo` alongside the block: the exact props behind the preview above. Spread it to get a working code-tabs panel in one line.

```tsx
import { Devtools3, devtools3Demo } from "@/components/beste/block/devtools3";

export default function DocsPage() {
  return <Devtools3 {...devtools3Demo} />;
}
```

Then replace the demo with your own props. Written out, a trimmed setup looks like this:

```tsx
import { Devtools3 } from "@/components/beste/block/devtools3";

export default function DocsPage() {
  return (
    <Devtools3
      heading="Install the SDK"
      description="Pick your language to get started."
      tabs={[
        {
          language: "javascript",
          label: "JavaScript",
          code: `npm install @acme/sdk`,
        },
        {
          language: "bash",
          label: "cURL",
          code: `curl https://api.acme.com/v1/ping`,
        },
      ]}
      labels={{ copy: "Copy", copied: "Copied!" }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `string` | – | Section heading above the code panel |
| `description` | `string` | – | Supporting text under the heading |
| `tabs` | `CodeTab[]` | `[]` | Language tabs, each with its own code sample |
| `labels` | `{ copy?: string; copied?: string }` | `{}` | Copy-button text, before and after copying |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type CodeTab = {
  language: string;
  label: string;
  code: string;
};
```

## Behavior notes

- Syntax highlighting runs client-side: a `useEffect` keyed on `activeTab` calls Shiki's `codeToHtml` with `theme: "github-dark"` and injects the result via `dangerouslySetInnerHTML`, so there's a brief moment on first paint (and on each tab switch) before the async highlight resolves.
- The copy button calls `navigator.clipboard.writeText` on the active tab's raw `code`, flips to a checkmark plus the `copied` label, and reverts to the `copy` label automatically after 2 seconds via `setTimeout`.
- Switching tabs resets the copy state immediately (`setIsCopied(false)` fires inside the tab's own `onClick`), so the button always reads "Copy" again after a tab change even if you just copied on the previous tab.
- The code surface is a fixed dark theme (`bg-zinc-950`, `border-zinc-800`, Shiki's `github-dark` theme) regardless of the page's light/dark mode; only the active tab's underline uses the semantic `border-primary` token.
- React keys tabs by `tab.language`, so two tabs sharing the same `language` value will collide during reconciliation; keep each tab's `language` field unique even if their displayed `label` differs.
