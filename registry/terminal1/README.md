# Terminal1: CLI Installation Typewriter

A fake terminal window used to demo CLI installation steps: mac-style traffic-light dots, a centered title, copy and restart controls, and a body that types each command character-by-character before "running" and typing out its output line.

<FreeCta />

## Installation

**Radix flavor**

```bash
npx shadcn add "https://ui.beste.co/r/terminal1"
```

**Base UI flavor**

```bash
npx shadcn add "https://ui.beste.co/r-base/terminal1"
```

This installs the block to `components/beste/block/terminal1.tsx` and the `badge` and `button` shadcn/ui primitives it depends on.

## Quick start

The installed file exports `terminal1Demo` alongside the block: the exact props behind the preview above. Spread it to get a working animated terminal in one line.

```tsx
import { Terminal1, terminal1Demo } from "@/components/beste/block/terminal1";

export default function QuickStartPage() {
  return <Terminal1 {...terminal1Demo} />;
}
```

Then replace the demo with your own props. Written out, the same setup looks like this:

```tsx
import { Terminal1 } from "@/components/beste/block/terminal1";

export default function QuickStartPage() {
  return (
    <Terminal1
      heading="Get started in seconds"
      description="Install the CLI and start building."
      terminal={{
        title: "Terminal",
        commands: [
          {
            id: "cmd-1",
            prompt: "$ ",
            command: "npm install -g @acme/cli",
            output: "Installing @acme/cli...\n✓ Installed successfully",
          },
          {
            id: "cmd-2",
            prompt: "$ ",
            command: "acme init my-project",
            output: "✓ Project initialized",
          },
        ],
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `badge` | `{ label: string; variant?: "default" \| "secondary" \| "outline" }` | – | Optional badge above the heading |
| `heading` | `string` | – | Section heading |
| `description` | `string` | – | Section intro text |
| `terminal` | `TerminalConfig` | – | Window title, commands, and typing timing |
| `showCopyButton` | `boolean` | `true` | Shows the header "copy all commands" button |
| `glowEffect` | `boolean` | `true` | Adds a drop shadow behind the terminal window |
| `className` | `string` | – | Extra classes for the outer `<section>` |

```ts
type TerminalConfig = {
  title?: string;
  commands: TerminalCommand[];
  typeSpeed?: number;
  delayBetweenCommands?: number;
  showLineNumbers?: boolean;
};

type TerminalCommand = {
  id: string;
  prompt?: string;
  command: string;
  output?: string;
  outputDelay?: number;
};
```

## Behavior notes

- The typing animation is gated behind an `IntersectionObserver` (30% threshold): nothing types until the terminal scrolls into view, so a section placed below the fold shows only a static blinking cursor until the visitor scrolls to it.
- Each command types at `terminal.typeSpeed` (default 50ms per character); after the command finishes, the block waits that command's own `outputDelay` (default 500ms) before typing its `output` at a fixed 10ms per character, hardcoded independently of `typeSpeed`.
- A blinking `|` cursor follows only whichever line is actively typing (command or output) and disappears once that line is done.
- A restart button (`RotateCcw` icon) appears in the header only after the whole sequence completes (`isComplete`), and calls `reset()` to replay everything from the first command.
- The "copy" button copies every command's prompt plus command text (not the output) joined by newlines to the clipboard, and swaps to a checkmark for two seconds as confirmation.
- The window chrome (background, border, prompt and text colors) is a fixed dark zinc palette independent of the site's light/dark theme, since it is meant to look like a literal terminal.
