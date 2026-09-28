"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface treatment of each key cap. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Cap size preset. Mirrors the inspector family; `sm` still sets text-sm. */
type Size = "sm" | "default" | "lg";

/** What sits between two caps: nothing, a plus, or the word "then". */
type Separator = "none" | "plus" | "then";

const toneStyles: Record<Tone, string> = {
  muted: "border-border/70 bg-muted [--kbd-edge:var(--color-border)]",
  outline: "border-border bg-background [--kbd-edge:var(--color-border)]",
  ghost: "border-transparent bg-transparent [--kbd-edge:transparent] data-[held=true]:border-border",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-6 min-w-6 px-1.5 text-sm",
  default: "h-7 min-w-7 px-2 text-sm",
  lg: "h-9 min-w-9 px-2.5 text-base",
};

// Same spring as inspector-slider: overshoots a hair, then settles, with no animation library
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

const MODIFIERS = new Set(["meta", "ctrl", "alt", "shift"]);

const ALIASES: Record<string, string> = {
  cmd: "meta",
  command: "meta",
  super: "meta",
  win: "meta",
  control: "ctrl",
  option: "alt",
  opt: "alt",
  return: "enter",
  escape: "esc",
  arrowup: "up",
  arrowdown: "down",
  arrowleft: "left",
  arrowright: "right",
  del: "delete",
  " ": "space",
  spacebar: "space",
  plus: "+",
};

interface KeyFace {
  /** What the cap shows. */
  glyph: string;
  /** How it is read aloud. */
  name: string;
}

const APPLE_FACES: Record<string, KeyFace> = {
  meta: { glyph: "⌘", name: "Command" },
  ctrl: { glyph: "⌃", name: "Control" },
  alt: { glyph: "⌥", name: "Option" },
  shift: { glyph: "⇧", name: "Shift" },
};

const OTHER_FACES: Record<string, KeyFace> = {
  meta: { glyph: "Win", name: "Windows" },
  ctrl: { glyph: "Ctrl", name: "Control" },
  alt: { glyph: "Alt", name: "Alt" },
  shift: { glyph: "Shift", name: "Shift" },
};

const SHARED_FACES: Record<string, KeyFace> = {
  enter: { glyph: "↵", name: "Enter" },
  esc: { glyph: "Esc", name: "Escape" },
  tab: { glyph: "⇥", name: "Tab" },
  space: { glyph: "Space", name: "Space" },
  backspace: { glyph: "⌫", name: "Backspace" },
  delete: { glyph: "⌦", name: "Delete" },
  up: { glyph: "↑", name: "Up arrow" },
  down: { glyph: "↓", name: "Down arrow" },
  left: { glyph: "←", name: "Left arrow" },
  right: { glyph: "→", name: "Right arrow" },
  home: { glyph: "Home", name: "Home" },
  end: { glyph: "End", name: "End" },
  pageup: { glyph: "PgUp", name: "Page up" },
  pagedown: { glyph: "PgDn", name: "Page down" },
  "+": { glyph: "+", name: "Plus" },
};

/** True on macOS and iOS, where `mod` means Command. Returns false during SSR. */
export function isApplePlatform() {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform ?? nav.platform ?? "";
  return /mac|iphone|ipad|ipod/i.test(platform) || /Mac OS X/.test(nav.userAgent);
}

function normalizeToken(raw: string) {
  const key = raw.trim().toLowerCase();
  if (key === "") return "";
  return ALIASES[key] ?? key;
}

/**
 * Splits a shortcut into key tokens. Combos are joined with `+` ("mod+shift+k");
 * sequences are separated by spaces, commas or "then" ("g then i").
 */
export function parseCombo(keys: string | string[], sequence = false): string[] {
  if (Array.isArray(keys)) return keys.map(normalizeToken).filter(Boolean);
  if (sequence) return keys.split(/\s*(?:,|\bthen\b|\s)\s*/i).map(normalizeToken).filter(Boolean);
  // A trailing "++" means the plus key itself
  const parts = keys.replace(/\+\+$/, "+plus").split("+");
  return parts.map(normalizeToken).filter(Boolean);
}

function faceOf(token: string, apple: boolean): KeyFace {
  const platformFaces = apple ? APPLE_FACES : OTHER_FACES;
  const resolved = token === "mod" ? (apple ? "meta" : "ctrl") : token;
  const face = platformFaces[resolved] ?? SHARED_FACES[resolved];
  if (face) return face;
  if (/^f\d{1,2}$/.test(resolved)) return { glyph: resolved.toUpperCase(), name: resolved.toUpperCase() };
  return { glyph: resolved.length === 1 ? resolved.toUpperCase() : resolved, name: resolved.toUpperCase() };
}

/** A shortcut as display text and as spoken text, e.g. `{ text: "⌘K", label: "Command K" }`. */
export function formatCombo(keys: string | string[], options: { apple?: boolean; sequence?: boolean } = {}) {
  const apple = options.apple ?? isApplePlatform();
  const faces = parseCombo(keys, options.sequence).map((token) => faceOf(token, apple));
  const joiner = options.sequence ? " then " : apple ? "" : "+";
  return {
    text: faces.map((face) => face.glyph).join(joiner),
    label: faces.map((face) => face.name).join(options.sequence ? " then " : " "),
  };
}

// The token a keyboard event stands for, independent of layout for letters and digits
function tokenFromEvent(event: KeyboardEvent) {
  const key = event.key;
  if (key === "Meta" || key === "OS") return "meta";
  if (key === "Control") return "ctrl";
  if (key === "Alt") return "alt";
  if (key === "Shift") return "shift";
  if (/^Key[A-Z]$/.test(event.code)) return event.code.slice(3).toLowerCase();
  if (/^Digit\d$/.test(event.code)) return event.code.slice(5);
  return normalizeToken(key);
}

function resolveMod(token: string, apple: boolean) {
  return token === "mod" ? (apple ? "meta" : "ctrl") : token;
}

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || /^(input|textarea|select)$/i.test(target.tagName);
}

interface KbdComboProps {
  /** The shortcut: "mod+shift+k", or an array of keys. `mod` is Command on Apple platforms and Control elsewhere. */
  keys: string | string[];
  /** Read `keys` as a sequence pressed one after another ("g then i") instead of held together. */
  sequence?: boolean;
  /**
   * What sits between caps. Defaults to "then" for sequences, and to "none" for combos.
   */
  separator?: Separator;
  /** Caps press down while the reader holds the real keys, and the combo glows when it is complete. */
  live?: boolean;
  /** Fires when the shortcut is pressed. The default action of that key press is prevented. */
  onTrigger?: (event: KeyboardEvent) => void;
  /**
   * Listen for the shortcut at all.
   * @defaultValue true */
  enabled?: boolean;
  /** Also answer while focus is in an input, textarea, select or editable element. */
  allowInInputs?: boolean;
  /**
   * Surface of each cap: filled (default), hairline outline, or bare until pressed.
   * @defaultValue "muted" */
  tone?: Tone;
  /**
   * Cap size preset.
   * @defaultValue "default" */
  size?: Size;
  className?: string;
  /** Accessible name. Falls back to the spelled-out shortcut, e.g. "Command K". */
  "aria-label"?: string;
}

export const kbdComboDemo: KbdComboProps = {
  keys: "mod+k",
  live: true,
  size: "lg",
};

export function KbdCombo({
  keys,
  sequence = false,
  separator,
  live = false,
  onTrigger,
  enabled = true,
  allowInInputs = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: KbdComboProps) {
  // Null until mounted, so the server and the first client render agree
  const [apple, setApple] = React.useState<boolean | null>(null);
  const [held, setHeld] = React.useState<ReadonlySet<string>>(() => new Set());
  const [reached, setReached] = React.useState(0);
  const [fired, setFired] = React.useState(false);

  React.useEffect(() => setApple(isApplePlatform()), []);

  const tokens = React.useMemo(() => parseCombo(keys, sequence), [keys, sequence]);
  const resolved = React.useMemo(() => tokens.map((token) => resolveMod(token, apple ?? false)), [tokens, apple]);
  const handler = React.useRef(onTrigger);
  handler.current = onTrigger;

  const listening = live || (enabled && Boolean(onTrigger));

  React.useEffect(() => {
    if (!listening || apple === null) return;
    let fireTimer = 0;
    let sequenceTimer = 0;
    let progress = 0;
    const pressed = new Set<string>();

    const flash = () => {
      window.clearTimeout(fireTimer);
      setFired(true);
      fireTimer = window.setTimeout(() => setFired(false), 650);
    };
    const sync = () => setHeld(new Set(pressed));
    const clear = () => {
      pressed.clear();
      sync();
    };

    const matchesCombo = (event: KeyboardEvent) => {
      const wantMods = resolved.filter((token) => MODIFIERS.has(token));
      const main = resolved.filter((token) => !MODIFIERS.has(token));
      const mods = { meta: event.metaKey, ctrl: event.ctrlKey, alt: event.altKey, shift: event.shiftKey };
      const modsOk = (Object.keys(mods) as (keyof typeof mods)[]).every((mod) => mods[mod] === wantMods.includes(mod));
      if (!modsOk) return false;
      if (main.length === 0) return false;
      return main.length === 1 && main[0] === tokenFromEvent(event);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const token = tokenFromEvent(event);
      if (live) {
        pressed.add(token);
        sync();
      }
      const blocked = !allowInInputs && isTyping(event.target);
      if (sequence) {
        if (MODIFIERS.has(token) || event.repeat) return;
        window.clearTimeout(sequenceTimer);
        progress = token === resolved[progress] ? progress + 1 : token === resolved[0] ? 1 : 0;
        if (progress === resolved.length) {
          progress = 0;
          if (live) flash();
          if (enabled && !blocked && handler.current) handler.current(event);
        }
        if (live) setReached(progress);
        // A sequence forgets a half-typed start after a second of quiet
        sequenceTimer = window.setTimeout(() => {
          progress = 0;
          if (live) setReached(0);
        }, 1000);
        return;
      }
      if (event.repeat || !matchesCombo(event)) return;
      if (live) flash();
      if (enabled && !blocked && handler.current) {
        event.preventDefault();
        handler.current(event);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (!live) return;
      const token = tokenFromEvent(event);
      pressed.delete(token);
      // macOS swallows keyups of other keys while Command is down
      if (token === "meta") for (const key of [...pressed]) if (!MODIFIERS.has(key)) pressed.delete(key);
      sync();
    };

    const onVisibility = () => {
      if (document.hidden) clear();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(fireTimer);
      window.clearTimeout(sequenceTimer);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", onVisibility);
      setHeld(new Set());
      setReached(0);
    };
  }, [listening, live, enabled, allowInInputs, sequence, resolved, apple]);

  const join: Separator = separator ?? (sequence ? "then" : "none");
  const faces = tokens.map((token) => faceOf(token, apple ?? false));
  const spoken = ariaLabel ?? faces.map((face) => face.name).join(sequence ? " then " : " ");

  return (
    <kbd
      data-slot="kbd-combo"
      data-fired={fired}
      className={cn("inline-flex items-center gap-1 font-sans font-normal not-italic select-none", className)}
      style={{ ["--kbd-spring" as string]: SPRING_EASE }}
    >
      <span className="sr-only">{spoken}</span>
      {faces.map((face, index) => {
        const token = resolved[index] ?? "";
        const isHeld = live && held.has(token);
        const isReached = live && sequence && index < reached;
        const pending = apple === null && tokens[index] === "mod";
        return (
          <React.Fragment key={`${tokens[index]}-${index}`}>
            {index > 0 && join !== "none" && (
              <span aria-hidden="true" data-slot="kbd-combo-separator" className="text-sm text-muted-foreground">
                {join === "plus" ? "+" : "then"}
              </span>
            )}
            <kbd
              aria-hidden="true"
              data-slot="kbd-combo-key"
              data-held={isHeld}
              data-reached={isReached}
              className={cn(
                "inline-flex items-center justify-center rounded-md border leading-none font-medium text-foreground/80",
                "shadow-[inset_0_-2px_0_var(--kbd-edge),0_1px_0_color-mix(in_oklab,var(--foreground)_6%,transparent)]",
                "motion-safe:transition-[translate,box-shadow,background-color,border-color,color,opacity] motion-safe:duration-300 motion-safe:ease-(--kbd-spring)",
                "data-[held=true]:translate-y-px data-[held=true]:text-foreground data-[held=true]:shadow-[inset_0_1px_2px_color-mix(in_oklab,var(--foreground)_18%,transparent)] data-[held=true]:duration-75",
                "data-[reached=true]:border-primary/40 data-[reached=true]:text-foreground",
                "in-data-[fired=true]:border-primary/50 in-data-[fired=true]:bg-primary/10 in-data-[fired=true]:text-foreground in-data-[fired=true]:ring-4 in-data-[fired=true]:ring-primary/15",
                pending && "opacity-0",
                sizeStyles[size],
                toneStyles[tone],
              )}
            >
              {face.glyph}
            </kbd>
          </React.Fragment>
        );
      })}
    </kbd>
  );
}
