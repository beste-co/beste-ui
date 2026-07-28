"use client";

import { ArrowDown01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type ComponentType, useCallback, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DEFAULT_REGISTRY_FLAVOR,
  REGISTRY_FLAVOR_STORAGE_KEY,
  type RegistryFlavor,
} from "@/lib/install-command";
import { FLAVOR_OPTIONS } from "@/lib/site-links";
import { cn } from "@/lib/utils";

const FLAVOR_EVENT = "beste-registry-flavor-change";

/**
 * Persisted base/radix choice for install commands. Defaults to "base"
 * (shadcn's default primitive library); SSR always renders "base" and the
 * stored choice is applied after hydration. Multiple toggles on one page
 * stay in sync via a custom event.
 */
export function useRegistryFlavor(): [
  RegistryFlavor,
  (flavor: RegistryFlavor) => void,
] {
  const [flavor, setFlavor] = useState<RegistryFlavor>(DEFAULT_REGISTRY_FLAVOR);

  useEffect(() => {
    const read = () => {
      const stored = window.localStorage.getItem(REGISTRY_FLAVOR_STORAGE_KEY);
      // A value left over from a deployment that offered more flavors than this
      // one does must not win: it would select sources that are not here.
      if (FLAVOR_OPTIONS.some((option) => option === stored)) {
        setFlavor(stored as RegistryFlavor);
      }
    };
    read();
    window.addEventListener(FLAVOR_EVENT, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(FLAVOR_EVENT, read);
      window.removeEventListener("storage", read);
    };
  }, []);

  const update = useCallback((next: RegistryFlavor) => {
    setFlavor(next);
    try {
      window.localStorage.setItem(REGISTRY_FLAVOR_STORAGE_KEY, next);
    } catch {
      // Private mode etc. — the in-memory state still works for this page.
    }
    window.dispatchEvent(new CustomEvent(FLAVOR_EVENT));
  }, []);

  return [flavor, update];
}

const VARIANT_ENDPOINTS = {
  block: (name: string) => `/r-base/${name}`,
  piece: (name: string) => `/piece/r-base/${name}`,
  component: (name: string) => `/component/r-base/${name}`,
} as const;

/**
 * Source code matching the selected flavor. Radix returns the passed-in
 * canonical source untouched; Base lazily fetches the generated variant from
 * the r-base endpoint (session cookie covers pro blocks, like the /r fetch
 * in the grid). Returns undefined while the base variant loads and falls
 * back to the radix source when the fetch fails (e.g. pro without a
 * license — the code pane is gated/obfuscated there anyway).
 */
export function useFlavoredSource(
  kind: keyof typeof VARIANT_ENDPOINTS,
  name: string,
  flavor: RegistryFlavor,
  radixSource: string | null | undefined
): string | null | undefined {
  const [baseSources, setBaseSources] = useState<
    Record<string, string | null>
  >({});

  useEffect(() => {
    if (flavor !== "base" || baseSources[name] !== undefined) return;
    let cancelled = false;
    fetch(VARIANT_ENDPOINTS[kind](name))
      .then(async (res) => {
        if (!res.ok) return null;
        const data = (await res.json()) as { files?: { content?: string }[] };
        return data.files?.[0]?.content ?? null;
      })
      .then((content) => {
        if (!cancelled) {
          setBaseSources((prev) => ({ ...prev, [name]: content }));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBaseSources((prev) => ({ ...prev, [name]: null }));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [flavor, kind, name, baseSources]);

  if (flavor !== "base") return radixSource;
  const fetched = baseSources[name];
  if (fetched === undefined) return undefined; // loading
  return fetched ?? radixSource;
}

function RadixIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Radix UI"
      className={className}
    >
      <path
        fill="currentColor"
        d="M11.52 24a7.68 7.68 0 0 1-7.68-7.68 7.68 7.68 0 0 1 7.68-7.68V24Zm0-24v7.68H3.84V0h7.68Zm4.8 7.68a3.84 3.84 0 1 1 0-7.68 3.84 3.84 0 0 1 0 7.68Z"
      />
    </svg>
  );
}

function BaseUiIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 17 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Base UI"
      className={className}
    >
      <path
        fill="currentColor"
        d="M9.5001 7.01537C9.2245 6.99837 9 7.22385 9 7.49999V23C13.4183 23 17 19.4183 17 15C17 10.7497 13.6854 7.27351 9.5001 7.01537Z"
      />
      <path
        fill="currentColor"
        d="M8 9.8V12V23C3.58172 23 0 19.0601 0 14.2V12V1C4.41828 1 8 4.93989 8 9.8Z"
      />
    </svg>
  );
}

interface FlavorOption {
  value: RegistryFlavor;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}

const BASE_OPTION: FlavorOption = { value: "base", label: "Base UI", Icon: BaseUiIcon };
const RADIX_OPTION: FlavorOption = { value: "radix", label: "Radix", Icon: RadixIcon };

const BY_FLAVOR: Record<RegistryFlavor, FlavorOption> = {
  base: BASE_OPTION,
  radix: RADIX_OPTION,
};

/** Only what this deployment can serve; see lib/site-links.ts. */
const OPTIONS: FlavorOption[] = FLAVOR_OPTIONS.map((flavor) => BY_FLAVOR[flavor]);

/** A picker over one option is not a choice, so it does not draw one. */
const HAS_CHOICE = OPTIONS.length > 1;

export function RegistryFlavorToggle({
  flavor,
  onChange,
  className,
}: {
  flavor: RegistryFlavor;
  onChange: (flavor: RegistryFlavor) => void;
  className?: string;
}) {
  if (!HAS_CHOICE) return null;

  return (
    <div
      role="radiogroup"
      aria-label="Primitive library"
      className={cn(
        "flex items-center rounded-md border bg-background p-0.5 text-sm",
        className
      )}
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={flavor === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "cursor-pointer rounded-sm px-2 py-0.5 whitespace-nowrap transition-colors",
            flavor === option.value
              ? "bg-muted font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Dropdown form of the flavor picker: a button showing the selected flavor's
 * icon + label; clicking opens a menu of icon + label options.
 */
export function RegistryFlavorSelect({
  flavor,
  onChange,
  className,
}: {
  flavor: RegistryFlavor;
  onChange: (flavor: RegistryFlavor) => void;
  className?: string;
}) {
  if (!HAS_CHOICE) return null;

  const active = OPTIONS.find((o) => o.value === flavor) ?? OPTIONS[0] ?? BASE_OPTION;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          // The same filled pill the search field, the picker and the pager wear.
          "flex h-11 cursor-pointer items-center gap-2 rounded-full bg-muted/60 px-4 text-base text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          className
        )}
        aria-label={`Primitive library: ${active.label}`}
      >
        <active.Icon className="size-4 shrink-0" />
        <span className="whitespace-nowrap">{active.label}</span>
        <HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={2} className="shrink-0 text-foreground/50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 rounded-xl">
        {OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => onChange(option.value)}
            className="cursor-pointer gap-2 text-base"
          >
            <option.Icon className="size-4 shrink-0" />
            <span className="flex-1">{option.label}</span>
            {flavor === option.value && (
              <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={2} className="shrink-0 text-foreground" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
