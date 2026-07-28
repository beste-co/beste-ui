"use client";

import { type LucideIcon, PlusIcon, XIcon } from "lucide-react";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/** Surface treatment of the row. Mirrors inspector-slider. */
type Tone = "muted" | "outline" | "ghost";

/** Row height preset. Mirrors inspector-slider. */
type Size = "sm" | "default" | "lg";

/** The row itself is the trigger, so it answers hover like any other in the family. */
const toneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted hover:bg-muted-foreground/15",
  outline: "border border-border hover:bg-muted",
  ghost: "border border-transparent hover:border-border hover:bg-muted",
};

const sizeStyles: Record<Size, string> = {
  sm: "[--inspector-height:--spacing(8)] [--inspector-pad:--spacing(2.5)]",
  default: "[--inspector-height:--spacing(9)] [--inspector-pad:--spacing(3)]",
  lg: "[--inspector-height:--spacing(11)] [--inspector-pad:--spacing(4)]",
};

/** Anything but a digit or a separator has no business in a track size. */
const NON_NUMERIC = /[^0-9.,]/g;

/** One column or row of the grid. */
interface Track {
  /** Left out for `auto`, which is a size the contents decide. */
  size?: number;
  /** `fr`, `px`, `%`, `auto`, or whatever `units` offers. */
  unit: string;
}

const DEFAULT_UNITS = ["fr", "px", "%", "auto"];

/**
 * What the tracks come to in CSS. Exported because the value is only useful once
 * it is a `grid-template-columns`, and every consumer otherwise writes this join
 * itself.
 */
export function tracksToCss(tracks: Track[]): string {
  if (tracks.length === 0) return "none";
  return tracks
    .map((track) => (track.unit === "auto" ? "auto" : `${track.size ?? 0}${track.unit}`))
    .join(" ");
}

interface InspectorTracksProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange`. */
  value?: Track[];
  /** Initial value in uncontrolled mode. */
  defaultValue?: Track[];
  onValueChange?: (value: Track[]) => void;
  /** Fires when the editor opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /**
   * The units a track may be measured in. `auto` is understood as "the contents
   * decide", and its number field steps aside.
   * @defaultValue ["fr", "px", "%", "auto"] */
  units?: string[];
  /**
   * How many tracks there may be.
   * @defaultValue 1 to 12 */
  minTracks?: number;
  maxTracks?: number;

  /** Block interaction and dim the row. */
  disabled?: boolean;
  /**
   * Surface treatment: filled (default), hairline outline, or bare until hover.
   * @defaultValue "muted" */
  tone?: Tone;
  /**
   * Row height preset.
   * @defaultValue "default" */
  size?: Size;

  className?: string;
  /** Accessible name. Falls back to `label`. */
  "aria-label"?: string;
}

export const inspectorTracksDemo: InspectorTracksProps = {
  label: "Columns",
  className: "w-72",
  defaultValue: [
    { size: 1, unit: "fr" },
    { size: 2, unit: "fr" },
    { size: 240, unit: "px" },
  ],
};

/**
 * The columns of a grid, as a list of lengths.
 *
 * A list, but not a record list: what the editor holds is one length per line, the
 * same thing inspector-unit holds, and the row above it stays a single line of CSS.
 * There is deliberately no reordering — a track's place in the list *is* its place
 * in the grid, and a drag handle would be the first step towards the repeater this
 * family already decided it does not want.
 */
export function InspectorTracks({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onOpenChange,
  units = DEFAULT_UNITS,
  minTracks = 1,
  maxTracks = 12,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorTracksProps) {
  const [internalValue, setInternalValue] = React.useState<Track[]>(
    defaultValue ?? [{ size: 1, unit: "fr" }],
  );
  const value = valueProp ?? internalValue;
  const [open, setOpen] = React.useState(false);

  const write = (next: Track[]) => {
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const patch = (index: number, changes: Partial<Track>) => {
    write(value.map((track, at) => (at === index ? { ...track, ...changes } : track)));
  };

  const add = () => {
    if (value.length >= maxTracks) return;
    // A new column copies the last one rather than starting at some fixed size: a
    // grid of equal columns is what most of them are, and it is the only guess
    // that costs nothing when it is wrong.
    const last = value[value.length - 1];
    write([...value, last ? { ...last } : { size: 1, unit: "fr" }]);
  };

  const remove = (index: number) => {
    if (value.length <= minTracks) return;
    write(value.filter((_, at) => at !== index));
  };

  const summary = tracksToCss(value);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        onOpenChange?.(next);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          data-slot="inspector-tracks"
          data-disabled={disabled}
          className={cn(
            "group/inspector-tracks flex w-full cursor-pointer items-center gap-2 text-left",
            "h-(--inspector-height) rounded-(--inspector-radius) px-(--inspector-pad)",
            "[--inspector-radius:var(--radius-xl)] transition-colors",
            "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
            sizeStyles[size],
            toneStyles[tone],
            className,
          )}
        >
          <span
            data-slot="inspector-tracks-label"
            className="flex min-w-0 shrink-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span className="truncate">{label}</span>
          </span>

          {/* The CSS itself, in mono: this is a value a reader will paste into a
              stylesheet, which is the case the row readouts set in mono. */}
          <span
            data-slot="inspector-tracks-value"
            className="ml-auto min-w-0 truncate font-mono text-sm font-medium text-foreground select-none"
          >
            {summary}
          </span>

          <span
            aria-hidden="true"
            data-slot="inspector-tracks-glyph"
            className="flex h-4 w-8 shrink-0 items-center gap-px overflow-hidden rounded-sm border border-border p-px"
          >
            <Proportions tracks={value} />
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-[var(--radix-popover-trigger-width)] min-w-64 p-3"
      >
        <div className="flex flex-col gap-3">
          {/* The same picture as the row's glyph, at a size where the shares are
              worth reading. It is the only thing here that says what `1fr 2fr`
              actually looks like, so it gets the surface of its own that the other
              editors in the family give their preview. */}
          <span
            aria-hidden="true"
            className="flex h-9 items-stretch gap-1 rounded-md bg-muted/50 p-1"
          >
            <Proportions tracks={value} labelled />
          </span>

          <div className="flex flex-col gap-1.5">
            {value.map((track, index) => {
              const isAuto = track.unit === "auto";

              return (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: a track's index is its identity — it has no other, and reordering is deliberately not offered
                  key={index}
                  className="flex items-center gap-1.5"
                >
                  <TrackSize
                    disabled={disabled || isAuto}
                    value={isAuto ? undefined : (track.size ?? 0)}
                    ariaLabel={`${ariaLabel ?? label} track ${index + 1} size`}
                    onCommit={(next) => patch(index, { size: next })}
                  />

                  {/*
                    The same menu the rest of the family opens, not the platform's:
                    four options four characters wide hardly need more, but a control
                    that opens the operating system's menu in the middle of an editor
                    built out of this one's is the odd one out on sight.

                    No `position` on the content, deliberately. The base codemod treats
                    that attribute on SelectContent as a hard flag, and shadcn's own
                    default is what is wanted here anyway, so passing it would buy
                    nothing and cost this component a hand-maintained override.
                  */}
                  <Select
                    value={track.unit}
                    disabled={disabled}
                    onValueChange={(unit) =>
                      patch(index, {
                        unit,
                        // Coming back off `auto` needs a number again, and the one
                        // it had before is gone; 1 is right for fr and harmless
                        // everywhere else.
                        size: unit === "auto" ? undefined : (track.size ?? 1),
                      })
                    }
                  >
                    <SelectTrigger
                      size="sm"
                      aria-label={`${ariaLabel ?? label} track ${index + 1} unit`}
                      className={cn(
                        // Framed like the field and the remove button it sits with.
                        "h-8 w-auto shrink-0 cursor-pointer gap-1 border-border bg-transparent px-2",
                        "font-mono text-sm font-medium text-foreground shadow-none",
                        "focus-visible:ring-2 focus-visible:ring-ring/50",
                      )}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end" className="min-w-20">
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit} className="cursor-pointer font-mono">
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={disabled || value.length <= minTracks}
                    aria-label={`Remove track ${index + 1}`}
                    className={cn(
                      // Framed like the field and the menu it sits with, and the same
                      // height as them, so the line reads as three controls rather
                      // than two and a mark floating beside them.
                      "flex size-8 shrink-0 cursor-pointer items-center justify-center",
                      "rounded-md border border-border bg-transparent",
                      "text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground",
                      "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      "disabled:pointer-events-none disabled:opacity-40",
                    )}
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={add}
            disabled={disabled || value.length >= maxTracks}
            data-slot="inspector-tracks-add"
            className={cn(
              "flex w-full cursor-pointer items-center justify-center gap-1.5",
              "border-t border-border pt-2 text-sm font-medium text-foreground/70 select-none",
              "transition-colors hover:text-foreground",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              "disabled:pointer-events-none disabled:opacity-40",
            )}
          >
            <PlusIcon className="size-3.5" />
            Add track
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * The tracks drawn at their relative shares. `fr` tracks grow, everything else
 * holds a size, which is exactly what the grid itself does — so the picture is
 * wrong in the same direction the CSS is, and never in a different one.
 */
function Proportions({ tracks, labelled = false }: { tracks: Track[]; labelled?: boolean }) {
  if (tracks.length === 0) return null;

  return (
    <>
      {tracks.map((track, index) => {
        const flexible = track.unit === "fr";
        const auto = track.unit === "auto";

        return (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: decorative bars mirroring the track list, which has no ids
            key={index}
            style={
              flexible
                ? { flexGrow: Math.max(track.size ?? 1, 0.01), flexBasis: 0 }
                : {
                    flexGrow: 0,
                    flexShrink: 1,
                    // A fixed track is drawn at its own size where that fits, and
                    // capped where it does not: the point is the share, not the
                    // millimetre.
                    flexBasis: auto ? "1.5rem" : `${track.size ?? 0}${track.unit}`,
                    maxWidth: "40%",
                  }
            }
            className={cn(
              "flex min-w-0.5 items-center justify-center rounded-[2px]",
              flexible ? "bg-foreground/25" : "bg-foreground/15",
            )}
          >
            {labelled ? (
              <span className="truncate px-0.5 font-mono text-sm text-foreground/70 select-none">
                {auto ? "auto" : `${track.size ?? 0}${track.unit}`}
              </span>
            ) : null}
          </span>
        );
      })}
    </>
  );
}

/** One track's number. Local: it is half a row, not a row. */
function TrackSize({
  value,
  disabled,
  ariaLabel,
  onCommit,
}: {
  value: number | undefined;
  disabled: boolean;
  ariaLabel: string;
  onCommit: (value: number) => void;
}) {
  const [draft, setDraft] = React.useState<string | null>(null);

  const accept = () => {
    if (draft === null) return;
    const parsed = Number.parseFloat(draft.replace(",", "."));
    setDraft(null);
    if (Number.isNaN(parsed)) return;
    onCommit(Math.max(0, parsed));
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      autoComplete="off"
      spellCheck={false}
      disabled={disabled}
      aria-label={ariaLabel}
      value={draft ?? (value === undefined ? "" : String(value))}
      placeholder={disabled ? "auto" : ""}
      onChange={(event) => setDraft(event.target.value.replace(NON_NUMERIC, ""))}
      onBlur={accept}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          accept();
          return;
        }
        if (event.key === "Escape") {
          event.preventDefault();
          setDraft(null);
          return;
        }
        const step = event.shiftKey ? 10 : 1;
        if (event.key === "ArrowUp") {
          event.preventDefault();
          setDraft(null);
          onCommit(Math.max(0, (value ?? 0) + step));
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          setDraft(null);
          onCommit(Math.max(0, (value ?? 0) - step));
        }
      }}
      className={cn(
        "h-8 min-w-0 flex-1 rounded-md border border-border bg-transparent px-2",
        "font-mono text-sm font-medium text-foreground tabular-nums outline-none",
        "placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
        "disabled:opacity-50",
      )}
    />
  );
}
