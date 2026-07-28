"use client";

import {
  ActivityIcon,
  BellIcon,
  BookmarkIcon,
  CalendarIcon,
  CameraIcon,
  CloudIcon,
  CompassIcon,
  FlameIcon,
  GiftIcon,
  GlobeIcon,
  HeartIcon,
  ImageIcon,
  LayersIcon,
  LeafIcon,
  type LucideIcon,
  MapPinIcon,
  MoonIcon,
  MusicIcon,
  RocketIcon,
  SearchIcon,
  ShieldIcon,
  SparklesIcon,
  SquareDashedIcon,
  StarIcon,
  SunIcon,
  TagIcon,
  XIcon,
  ZapIcon,
} from "lucide-react";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

/** Number of icons above which the search field earns its place. */
const SEARCH_THRESHOLD = 16;

interface InspectorIconChoice {
  /** Value reported on selection, and what the search matches against. */
  name: string;
  icon: LucideIcon;
  /** Shown in the tooltip and read by screen readers. Falls back to `name`. */
  label?: string;
}

interface InspectorIconProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /**
   * The icons on offer. Passing the set rather than importing one keeps this
   * component out of the business of bundling an icon library — hand it the
   * subset that belongs to whatever is being edited.
   */
  icons?: InspectorIconChoice[];

  /** Controlled selection, by `name`. Pair it with `onValueChange`. */
  value?: string;
  /** Initial selection in uncontrolled mode. */
  defaultValue?: string;
  onValueChange?: (name: string) => void;
  /** Fires when the palette opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /** Offer a clear button once something is selected. */
  clearable?: boolean;
  /**
   * Show the search field. Defaults to on once there are more than sixteen icons.
   */
  searchable?: boolean;
  /**
   * Icons per row in the palette.
   * @defaultValue 8 */
  columns?: number;
  /** Message shown when nothing matches the search. */
  emptyMessage?: string;

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

export const inspectorIconDemo: InspectorIconProps = {
  label: "Icon",
  className: "w-72",
  defaultValue: "zap",
  clearable: true,
  icons: [
    { name: "sparkles", icon: SparklesIcon },
    { name: "star", icon: StarIcon },
    { name: "heart", icon: HeartIcon },
    { name: "flame", icon: FlameIcon },
    { name: "zap", icon: ZapIcon },
    { name: "sun", icon: SunIcon },
    { name: "moon", icon: MoonIcon },
    { name: "cloud", icon: CloudIcon },
    { name: "leaf", icon: LeafIcon },
    { name: "globe", icon: GlobeIcon },
    { name: "compass", icon: CompassIcon },
    { name: "map-pin", icon: MapPinIcon },
    { name: "rocket", icon: RocketIcon },
    { name: "shield", icon: ShieldIcon },
    { name: "gift", icon: GiftIcon },
    { name: "tag", icon: TagIcon },
    { name: "bookmark", icon: BookmarkIcon },
    { name: "bell", icon: BellIcon },
    { name: "calendar", icon: CalendarIcon },
    { name: "camera", icon: CameraIcon },
    { name: "image", icon: ImageIcon },
    { name: "layers", icon: LayersIcon },
    { name: "music", icon: MusicIcon },
    { name: "activity", icon: ActivityIcon },
  ],
};

export function InspectorIcon({
  label,
  icon: Icon,
  icons = [],
  value: valueProp,
  defaultValue,
  onValueChange,
  onOpenChange,
  clearable = false,
  searchable,
  columns = 8,
  emptyMessage = "No icons found",
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorIconProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const value = valueProp ?? internalValue;

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const showSearch = searchable ?? icons.length > SEARCH_THRESHOLD;

  const matches = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return icons;
    return icons.filter(
      (choice) =>
        choice.name.toLowerCase().includes(needle) ||
        choice.label?.toLowerCase().includes(needle),
    );
  }, [icons, query]);

  const selected = React.useMemo(
    () => icons.find((choice) => choice.name === value),
    [icons, value],
  );

  const select = (name: string) => {
    if (valueProp === undefined) setInternalValue(name);
    onValueChange?.(name);
    setOpen(false);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
    // A palette opens on a clean search, never on whatever was typed last time.
    if (next) setQuery("");
  };

  const SelectedIcon = selected?.icon;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      {/*
        The row is the trigger outright — nothing else in it presses now that
        clearing moved into the palette — which is also what lets the palette take
        the trigger width and line up with the row edge for edge.
      */}
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          data-slot="inspector-icon"
          data-disabled={disabled}
          className={cn(
            "group/inspector-icon flex w-full cursor-pointer items-center gap-2 text-left",
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
            data-slot="inspector-icon-label"
            className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span className="truncate">{label}</span>
          </span>

          {/* The name earns its place next to the glyph: it tells star from
              sparkles the way no glyph pair can on its own. Set in the body face,
              not mono — it is a name, like a select's option, and not a code
              value the way a hex or a file path is. */}
          <span
            data-slot="inspector-icon-value"
            className="ml-auto min-w-0 truncate text-sm font-medium text-foreground select-none"
          >
            {selected ? (selected.label ?? selected.name) : ""}
          </span>

          <span
            aria-hidden="true"
            data-slot="inspector-icon-glyph"
            className="flex size-5 shrink-0 items-center justify-center text-foreground"
          >
            {SelectedIcon ? (
              <SelectedIcon className="size-4" />
            ) : (
              <SquareDashedIcon className="size-4 text-muted-foreground/60" />
            )}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-[var(--radix-popover-trigger-width)] min-w-56 p-2"
      >
        {showSearch ? (
          <div className="relative mb-2">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-foreground/70" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search icons"
              aria-label="Search icons"
              autoComplete="off"
              className={cn(
                "h-8 w-full rounded-md border border-border bg-transparent pr-2 pl-8",
                "text-sm outline-none placeholder:text-muted-foreground",
                "focus-visible:ring-2 focus-visible:ring-ring/50",
              )}
            />
          </div>
        ) : null}

        {matches.length === 0 ? (
          <p className="px-1 py-2 text-sm text-foreground/70 select-none">{emptyMessage}</p>
        ) : (
          <div
            className="grid max-h-56 gap-1 overflow-y-auto"
            style={{ gridTemplateColumns: `repeat(${Math.max(columns, 1)}, minmax(0, 1fr))` }}
          >
            {matches.map((choice) => {
              const ChoiceIcon = choice.icon;
              const isSelected = choice.name === value;

              return (
                <button
                  key={choice.name}
                  type="button"
                  onClick={() => select(choice.name)}
                  title={choice.label ?? choice.name}
                  aria-label={choice.label ?? choice.name}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex aspect-square w-full cursor-pointer items-center justify-center rounded-md",
                    "text-foreground/70 transition-colors hover:bg-accent hover:text-foreground",
                    "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    isSelected && "bg-foreground/10 text-foreground",
                  )}
                >
                  <ChoiceIcon className="size-4" />
                </button>
              );
            })}
          </div>
        )}

        {/*
          Clearing belongs with the choosing, not next to the value: it is the
          same decision, it needs a word rather than a glyph to be unmistakable,
          and it leaves the row with a single meaning per press.
        */}
        {clearable && value ? (
          <button
            type="button"
            onClick={() => select("")}
            data-slot="inspector-icon-clear"
            className={cn(
              "mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5",
              "border-t border-border pt-2 text-sm font-medium text-foreground/70 select-none",
              "transition-colors hover:text-foreground",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            )}
          >
            <XIcon className="size-3.5" />
            Remove {label}
          </button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
