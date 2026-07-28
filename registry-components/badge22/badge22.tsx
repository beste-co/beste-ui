import { cn } from "@/lib/utils";

type Tone = "muted" | "outline";

interface Badge22Props {
  /** The keys, one per keycap (e.g. ["⌘", "K"]) */
  keys: string[];
  /** Muted text after the keys (e.g. "to search") */
  label?: string;
  /** Keycap style: muted fill (default) or bordered outline */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  muted: "border-b-2 border-border bg-muted",
  outline: "border border-b-2 border-border bg-background",
};

export const badge22Demo: Badge22Props = {
  keys: ["⌘", "K"],
  label: "to search",
};

/** Keyboard-shortcut hint: real keycaps plus a muted explainer, dev-tool landings, command palettes. */
export function Badge22({ keys, label, tone = "muted", className }: Badge22Props) {
  return (
    <span className={cn("inline-flex w-fit items-center gap-1.5", className)}>
      {keys.map((key) => (
        <kbd
          key={key}
          className={cn(
            "flex min-w-6 items-center justify-center rounded-md px-1.5 py-0.5 font-mono text-sm font-medium text-foreground",
            toneStyles[tone]
          )}
        >
          {key}
        </kbd>
      ))}
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </span>
  );
}
