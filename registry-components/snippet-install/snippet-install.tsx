"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface treatment of the block. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Size preset. Mirrors the inspector family; `sm` still sets text-sm. */
type Size = "sm" | "default" | "lg";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

/** `add` installs packages into the project, `exec` runs one without installing it. */
export type SnippetKind = "add" | "exec";

export interface SnippetInstallProps {
  /** Packages to install or run, e.g. `"motion"` or `["react-hook-form", "zod"]`. For `exec`, the whole invocation: `"shadcn@latest add button"`. */
  packages?: string | string[];
  /** Install as a dev dependency. Ignored for `exec`. */
  dev?: boolean;
  /** `add` installs, `exec` runs with npx, pnpm dlx, yarn dlx or bunx. */
  kind?: SnippetKind;
  /** Exact command per manager. Wins over the derived one for any manager it names. */
  commands?: Partial<Record<PackageManager, string>>;
  /** Tabs to show, in order. */
  managers?: PackageManager[];
  /** Tab shown before the reader has picked one. */
  defaultManager?: PackageManager;
  /** Remember the pick, shared by every snippet on the page and across visits. */
  remember?: boolean;
  /** Storage key for the remembered pick. Snippets sharing a key stay in step. */
  storageKey?: string;
  /** Show a `$` prompt before the command. */
  prompt?: boolean;
  /** Called after the command lands on the clipboard. */
  onCopy?: (command: string, manager: PackageManager) => void;
  tone?: Tone;
  size?: Size;
  className?: string;
  /** Accessible name for the tab list. */
  "aria-label"?: string;
}

export const snippetInstallDemo: SnippetInstallProps = {
  packages: ["motion", "lucide-react"],
  kind: "add",
  size: "default",
  className: "w-full max-w-md",
};

const MANAGERS: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];
const DEFAULT_KEY = "beste:package-manager";

const toneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted",
  outline: "border border-border bg-background",
  ghost: "border border-transparent bg-transparent",
};

const sizeStyles: Record<Size, { tab: string; code: string; button: string; icon: string }> = {
  sm: { tab: "h-7 px-2.5 text-sm", code: "px-3 py-2.5 text-sm", button: "size-7", icon: "size-3.5" },
  default: { tab: "h-8 px-3 text-sm", code: "px-3.5 py-3 text-sm", button: "size-8", icon: "size-4" },
  lg: { tab: "h-9 px-3.5 text-base", code: "px-4 py-3.5 text-base", button: "size-9", icon: "size-4" },
};

// Same spring as inspector-slider: overshoots a hair, then settles, with no animation library
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

/** The command a manager runs for `packages`, with `dev` and `kind` applied. */
export function commandFor(manager: PackageManager, packages: string | string[] = [], { dev = false, kind = "add" }: { dev?: boolean; kind?: SnippetKind } = {}) {
  const list = (Array.isArray(packages) ? packages : [packages]).filter(Boolean).join(" ");
  if (kind === "exec") {
    const runner = { npm: "npx", pnpm: "pnpm dlx", yarn: "yarn dlx", bun: "bunx" }[manager];
    return `${runner} ${list}`.trim();
  }
  const verb = { npm: "npm install", pnpm: "pnpm add", yarn: "yarn add", bun: "bun add" }[manager];
  const flag = dev ? { npm: " -D", pnpm: " -D", yarn: " -D", bun: " -d" }[manager] : "";
  return `${verb}${flag} ${list}`.trim();
}

// One pick per storage key, shared by every snippet on the page; other tabs arrive through the storage event
const picks = new Map<string, PackageManager | null>();
const listeners = new Set<() => void>();

function readPick(key: string): PackageManager | null {
  if (picks.has(key)) return picks.get(key) ?? null;
  let stored: PackageManager | null = null;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw && (MANAGERS as string[]).includes(raw)) stored = raw as PackageManager;
  } catch {}
  picks.set(key, stored);
  return stored;
}

function writePick(key: string, manager: PackageManager, persist: boolean) {
  picks.set(key, manager);
  if (persist) {
    try {
      window.localStorage.setItem(key, manager);
    } catch {}
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || !picks.has(event.key)) return;
    picks.delete(event.key);
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function SnippetInstall({
  packages = [],
  dev = false,
  kind = "add",
  commands,
  managers = MANAGERS,
  defaultManager,
  remember = true,
  storageKey = DEFAULT_KEY,
  prompt = true,
  onCopy,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel = "Package manager",
}: SnippetInstallProps) {
  const id = React.useId();
  const tabs = managers.length > 0 ? managers : MANAGERS;
  const fallback = defaultManager && tabs.includes(defaultManager) ? defaultManager : (tabs[0] ?? "npm");
  const [local, setLocal] = React.useState<PackageManager | null>(null);
  // The server has no storage, so it and the first client render agree on the fallback
  const shared = React.useSyncExternalStore(
    subscribe,
    () => (remember ? readPick(storageKey) : null),
    () => null,
  );
  const picked = remember ? shared : local;
  const active = picked && tabs.includes(picked) ? picked : fallback;
  const index = Math.max(tabs.indexOf(active), 0);
  const command = commands?.[active] ?? commandFor(active, packages, { dev, kind });

  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const styles = sizeStyles[size];

  const pick = (manager: PackageManager) => {
    if (remember) writePick(storageKey, manager, true);
    else setLocal(manager);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = tabs.length - 1;
    let next = -1;
    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next < 0) return;
    event.preventDefault();
    const manager = tabs[next];
    if (!manager) return;
    pick(manager);
    tabRefs.current[next]?.focus();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      return;
    }
    setCopied(true);
    onCopy?.(command, active);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      data-slot="snippet-install"
      data-copied={copied}
      // Concentric with the tab row: the tab's 6px plus the row's 4px padding plus the 1px border
      className={cn("group/snippet w-full overflow-hidden rounded-[11px]", toneStyles[tone], className)}
      style={{ "--snippet-ease": SPRING_EASE } as React.CSSProperties}
    >
      <div className="flex items-center gap-2 border-b border-border/60 p-1">
        <div
          role="tablist"
          aria-label={ariaLabel}
          onKeyDown={onKeyDown}
          className="relative grid"
          style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
        >
          {/* Equal-width tabs let the marker be placed by index alone, so the slide stays on the compositor */}
          <span
            aria-hidden="true"
            data-slot="snippet-install-marker"
            className="pointer-events-none absolute inset-y-0 left-0 rounded-md bg-foreground/10 motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-(--snippet-ease)"
            style={{ width: `${100 / tabs.length}%`, transform: `translateX(${index * 100}%)` }}
          />
          {tabs.map((manager, i) => {
            const selected = manager === active;
            return (
              <button
                key={manager}
                ref={(node) => {
                  tabRefs.current[i] = node;
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${manager}`}
                aria-selected={selected}
                aria-controls={`${id}-panel`}
                tabIndex={selected ? 0 : -1}
                data-state={selected ? "on" : "off"}
                onClick={() => pick(manager)}
                className={cn(
                  "relative cursor-pointer rounded-md font-medium select-none transition-colors outline-none",
                  "focus-visible:ring-2 focus-visible:ring-ring/50",
                  styles.tab,
                  selected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {manager}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : `Copy ${command}`}
          className={cn(
            "relative ml-auto grid shrink-0 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors outline-none",
            "hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
            styles.button,
          )}
        >
          {/* The two icons trade places on the spring: copy shrinks away as the check lands */}
          <CopyIcon
            aria-hidden="true"
            className={cn(
              "col-start-1 row-start-1 motion-safe:transition-[opacity,scale] motion-safe:duration-500 motion-safe:ease-(--snippet-ease)",
              styles.icon,
              "group-data-[copied=true]/snippet:scale-50 group-data-[copied=true]/snippet:opacity-0",
            )}
          />
          <CheckIcon
            aria-hidden="true"
            className={cn(
              "col-start-1 row-start-1 scale-50 text-foreground opacity-0 motion-safe:transition-[opacity,scale] motion-safe:duration-500 motion-safe:ease-(--snippet-ease)",
              styles.icon,
              "group-data-[copied=true]/snippet:scale-100 group-data-[copied=true]/snippet:opacity-100",
            )}
          />
        </button>
        <span aria-live="polite" className="sr-only">
          {copied ? "Copied" : ""}
        </span>
      </div>

      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${active}`}
        // Scrolls sideways rather than wrapping, since a wrapped command is easy to misread
        tabIndex={0}
        className="overflow-x-auto outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
      >
        <pre className={cn("w-max min-w-full font-mono whitespace-pre", styles.code)}>
          {prompt && (
            <span aria-hidden="true" className="mr-2 text-muted-foreground select-none">
              $
            </span>
          )}
          <code className="text-foreground select-text">{command}</code>
        </pre>
      </div>
    </div>
  );
}
