"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/** Surface treatment of each pill. */
type Tone = "muted" | "outline" | "ghost";

/** Density preset. */
type Size = "sm" | "default" | "lg";

export interface Reaction {
  emoji: string;
  /** How many other people reacted with it; your own reaction is added on top. */
  count: number;
  /** Who reacted, most recent first. The tooltip names the first few. */
  by?: string[];
  /** Spoken name of the emoji. Common ones are named already. */
  label?: string;
}

interface ReactionBarProps {
  reactions: Reaction[];
  /** Emojis you have reacted with (controlled). */
  value?: string[];
  /** Emojis you have reacted with at first (uncontrolled). */
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /**
   * Emojis offered by the "+" button. An empty list hides it.
   * @defaultValue a set of 16 common reactions */
  choices?: string[];
  /**
   * Word used for you in the tooltip.
   * @defaultValue "You" */
  youLabel?: string;
  /**
   * Names listed in a tooltip before "and N others".
   * @defaultValue 3 */
  maxNames?: number;
  /** @defaultValue "muted" */
  tone?: Tone;
  /** @defaultValue "default" */
  size?: Size;
  className?: string;
  /** Accessible name for the group. */
  "aria-label"?: string;
}

export const reactionBarDemo: ReactionBarProps = {
  reactions: [
    { emoji: "🔥", count: 12, by: ["Nina Simone", "Miles Davis", "Björk", "Fela Kuti"] },
    { emoji: "❤️", count: 7, by: ["Joni Mitchell", "Aretha Franklin", "Ryuichi Sakamoto"] },
    { emoji: "👏", count: 3, by: ["Herbie Hancock", "Erykah Badu", "Thom Yorke"] },
    { emoji: "🎧", count: 1, by: ["Sade Adu"] },
  ],
  defaultValue: ["❤️"],
  "aria-label": "Reactions",
};

/** Same spring the inspector family uses. */
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

const DEFAULT_CHOICES = ["👍", "❤️", "🔥", "👏", "😂", "😮", "😢", "🙏", "🎉", "🚀", "👀", "💯", "🎧", "🎸", "✨", "🙌"];

/** Spoken names for common emojis; anything else falls back to the emoji itself. */
export const emojiNames: Record<string, string> = {
  "👍": "thumbs up",
  "❤️": "heart",
  "🔥": "fire",
  "👏": "clapping",
  "😂": "laughing",
  "😮": "surprised",
  "😢": "sad",
  "🙏": "thank you",
  "🎉": "celebrate",
  "🚀": "rocket",
  "👀": "eyes",
  "💯": "hundred",
  "🎧": "headphones",
  "🎸": "guitar",
  "✨": "sparkles",
  "🙌": "raised hands",
};

const toneStyles: Record<Tone, string> = {
  muted: "border-transparent bg-muted hover:bg-muted/70",
  outline: "border-border bg-transparent hover:bg-muted/60",
  ghost: "border-transparent bg-transparent hover:bg-muted/60",
};

const sizeStyles: Record<Size, { pill: string; emoji: string }> = {
  sm: { pill: "h-7 gap-1 px-2 text-sm", emoji: "text-sm" },
  default: { pill: "h-8 gap-1.5 px-2.5 text-sm", emoji: "text-base" },
  lg: { pill: "h-10 gap-2 px-3.5 text-base", emoji: "text-lg" },
};

/** Particles thrown out of a pill when you add your reaction. */
const BURST = [
  [-18, -16],
  [0, -22],
  [18, -16],
  [-20, 4],
  [20, 4],
  [0, 16],
] as const;

/** "You, Nina Simone and 9 others" for the tooltip and the spoken label. */
export function whoReacted(names: string[], total: number, maxNames = 3) {
  const shown = names.slice(0, maxNames);
  const rest = total - shown.length;
  if (shown.length === 0) return total === 1 ? "1 person" : `${total} people`;
  if (rest <= 0) return shown.length === 1 ? (shown[0] ?? "") : `${shown.slice(0, -1).join(", ")} and ${shown[shown.length - 1]}`;
  return `${shown.join(", ")} and ${rest} ${rest === 1 ? "other" : "others"}`;
}

function Count({ value }: { value: number }) {
  const previous = React.useRef(value);
  const up = value >= previous.current;
  React.useEffect(() => {
    previous.current = value;
  }, [value]);
  // Keyed by the value, so each new number rolls in from the side it is moving toward
  return (
    <span className="relative inline-grid overflow-hidden tabular-nums">
      <span
        key={value}
        className={cn(
          "col-start-1 row-start-1 motion-safe:transition-[translate,opacity] motion-safe:duration-300 motion-safe:ease-(--reaction-ease)",
          up ? "motion-safe:starting:translate-y-full" : "motion-safe:starting:-translate-y-full",
          "motion-safe:starting:opacity-0",
        )}
      >
        {value}
      </span>
    </span>
  );
}

export function ReactionBar({
  reactions,
  value: valueProp,
  defaultValue = [],
  onValueChange,
  choices = DEFAULT_CHOICES,
  youLabel = "You",
  maxNames = 3,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel = "Reactions",
}: ReactionBarProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const value = valueProp ?? inner;
  const [open, setOpen] = React.useState(false);
  const [bursts, setBursts] = React.useState<{ emoji: string; id: number }[]>([]);
  const burstId = React.useRef(0);

  const setValue = (next: string[]) => {
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
  };

  const toggle = (emoji: string) => {
    const on = value.includes(emoji);
    setValue(on ? value.filter((item) => item !== emoji) : [...value, emoji]);
    if (!on) {
      const id = ++burstId.current;
      setBursts((current) => [...current, { emoji, id }]);
      setTimeout(() => setBursts((current) => current.filter((burst) => burst.id !== id)), 700);
    }
  };

  // Your reactions to emojis nobody else used yet get a pill of their own, at the end
  const known = new Set(reactions.map((reaction) => reaction.emoji));
  const pills = [
    ...reactions,
    ...value.filter((emoji) => !known.has(emoji)).map((emoji): Reaction => ({ emoji, count: 0 })),
  ].filter((reaction) => reaction.count > 0 || value.includes(reaction.emoji));

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      style={{ "--reaction-ease": SPRING_EASE } as React.CSSProperties}
      className={cn("flex flex-wrap items-center gap-1.5", className)}
    >
      {pills.map((reaction) => {
        const mine = value.includes(reaction.emoji);
        const total = reaction.count + (mine ? 1 : 0);
        const names = [...(mine ? [youLabel] : []), ...(reaction.by ?? [])];
        const who = whoReacted(names, total, maxNames);
        const name = reaction.label ?? emojiNames[reaction.emoji] ?? reaction.emoji;
        return (
          <span key={reaction.emoji} className="group/pill relative motion-safe:transition-[scale,opacity] motion-safe:duration-300 motion-safe:ease-(--reaction-ease) motion-safe:starting:scale-50 motion-safe:starting:opacity-0">
            <button
              type="button"
              aria-pressed={mine}
              aria-label={`${name}, ${total} ${total === 1 ? "reaction" : "reactions"}: ${who}`}
              onClick={() => toggle(reaction.emoji)}
              data-pressed={mine}
              className={cn(
                "flex cursor-pointer select-none items-center rounded-full border font-medium text-muted-foreground outline-none",
                "motion-safe:transition-[background-color,border-color,color,scale] motion-safe:duration-200 active:scale-95",
                "focus-visible:ring-2 focus-visible:ring-ring",
                toneStyles[tone],
                sizeStyles[size].pill,
                mine && "border-foreground/25 bg-foreground/10 text-foreground hover:bg-foreground/15",
              )}
            >
              <span aria-hidden="true" className={cn("leading-none", sizeStyles[size].emoji)}>
                {reaction.emoji}
              </span>
              <Count value={total} />
            </button>

            {bursts
              .filter((burst) => burst.emoji === reaction.emoji)
              .map((burst) => (
                <span key={burst.id} aria-hidden="true" className="pointer-events-none absolute left-[1.1rem] top-1/2 motion-reduce:hidden">
                  {BURST.map(([x, y], index) => (
                    <span
                      key={index}
                      style={{ "--bx": `${x}px`, "--by": `${y}px` } as React.CSSProperties}
                      className="absolute -ml-0.75 -mt-0.75 size-1.5 translate-x-(--bx) translate-y-(--by) rounded-full bg-foreground/60 opacity-0 transition-[translate,opacity] duration-500 ease-out starting:translate-x-0 starting:translate-y-0 starting:opacity-100"
                    />
                  ))}
                </span>
              ))}

            {/* Names on hover or focus; the button already speaks them */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-64 -translate-x-1/2 select-none rounded-md bg-foreground px-2.5 py-1.5 text-sm text-background opacity-0 shadow-md motion-safe:transition-opacity motion-safe:duration-150 group-hover/pill:opacity-100 group-hover/pill:delay-300 group-has-[:focus-visible]/pill:opacity-100"
            >
              {who}
            </span>
          </span>
        );
      })}

      {choices.length > 0 && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Add a reaction"
              className={cn(
                "flex cursor-pointer select-none items-center justify-center rounded-full border text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                "motion-safe:transition-[background-color,color] motion-safe:duration-200",
                toneStyles[tone],
                sizeStyles[size].pill,
                "aspect-square px-0",
              )}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-4">
                <circle cx="12" cy="12" r="9" />
                <path d="M9 10h.01M15 10h.01M8.5 14.5a4 4 0 0 0 7 0" />
                <path d="M19 3v4M17 5h4" />
              </svg>
            </button>
          </PopoverTrigger>
          {/* Concentric corners: the emoji cell's 6px plus the 6px padding plus the 1px border */}
          <PopoverContent align="start" className="w-auto rounded-[13px] p-1.5">
            <div role="group" aria-label="Pick a reaction" className="grid grid-cols-8 gap-0.5">
              {choices.map((emoji) => {
                const mine = value.includes(emoji);
                return (
                  <button
                    key={emoji}
                    type="button"
                    aria-pressed={mine}
                    aria-label={emojiNames[emoji] ?? emoji}
                    onClick={() => {
                      toggle(emoji);
                      setOpen(false);
                    }}
                    className={cn(
                      "grid size-9 cursor-pointer place-items-center rounded-md text-lg outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
                      "motion-safe:transition-[background-color,scale] motion-safe:duration-150 active:scale-90",
                      mine && "bg-foreground/10",
                    )}
                  >
                    <span aria-hidden="true">{emoji}</span>
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
