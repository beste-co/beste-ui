"use client";

// Global ⌘K palette. Semantic + lexical search across blocks/pieces/components/pages
// via /api/search, plus static navigation. cmdk's own filtering is disabled
// (shouldFilter={false}) so semantic hits that lack the literal query still show.
import { Fragment, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Book02Icon,
  BrowserIcon,
  Clock01Icon,
  DashboardSquare01Icon,
  GridIcon,
  News01Icon,
  PuzzleIcon,
  Search01Icon,
  SparklesIcon,
  Tag01Icon,
  TerminalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { ProBadge } from "@/components/pro-badge";
import { cn } from "@/lib/utils";
import { useCommandPalette } from "@/lib/command-palette-store";

interface Hit {
  type: "block" | "piece" | "component" | "page";
  name: string;
  title: string;
  description: string;
  category: string;
  isPro: boolean;
  href: string;
}

const STATIC_NAV: { label: string; href: string; icon: React.ReactNode }[] = [
  { label: "Browse blocks", href: "/blocks", icon: <HugeiconsIcon icon={GridIcon} size={20} strokeWidth={2} /> },
  { label: "Browse pieces", href: "/pieces", icon: <HugeiconsIcon icon={PuzzleIcon} size={20} strokeWidth={2} /> },
  { label: "Browse components", href: "/components", icon: <HugeiconsIcon icon={DashboardSquare01Icon} size={20} strokeWidth={2} /> },
  { label: "Blog", href: "/blog", icon: <HugeiconsIcon icon={News01Icon} size={20} strokeWidth={2} /> },
  { label: "Pricing", href: "/pricing", icon: <HugeiconsIcon icon={Tag01Icon} size={20} strokeWidth={2} /> },
  { label: "What's new", href: "/changelog", icon: <HugeiconsIcon icon={Clock01Icon} size={20} strokeWidth={2} /> },
  { label: "Documentation", href: "/docs", icon: <HugeiconsIcon icon={Book02Icon} size={20} strokeWidth={2} /> },
  { label: "AI & MCP for agents", href: "/docs/mcp", icon: <HugeiconsIcon icon={TerminalIcon} size={20} strokeWidth={2} /> },
];

const GROUP_LABEL: Record<Hit["type"], string> = {
  block: "Blocks",
  page: "Pages",
  piece: "Pieces",
  component: "Components",
};

const TYPE_ICON: Record<Hit["type"], React.ReactNode> = {
  block: <HugeiconsIcon icon={GridIcon} size={20} strokeWidth={2} />,
  page: <HugeiconsIcon icon={BrowserIcon} size={20} strokeWidth={2} />,
  piece: <HugeiconsIcon icon={PuzzleIcon} size={20} strokeWidth={2} />,
  component: <HugeiconsIcon icon={DashboardSquare01Icon} size={20} strokeWidth={2} />,
};

/*
 * The palette in the site's own language: the field is the same filled pill the
 * header, the listing bars and the search page wear, the rows are round-cornered
 * and set at reading size, and nothing is outlined — the shapes and the fills do
 * the work a border used to.
 */
const COMMAND_CLASS = cn(
  "gap-1 p-3",
  // Search field → a borderless filled pill (the default is a bottom-ruled row).
  "[&_[data-slot=command-input-wrapper]]:mb-2 [&_[data-slot=command-input-wrapper]]:h-11 [&_[data-slot=command-input-wrapper]]:gap-2.5 [&_[data-slot=command-input-wrapper]]:rounded-full [&_[data-slot=command-input-wrapper]]:border-0 [&_[data-slot=command-input-wrapper]]:bg-muted/60 [&_[data-slot=command-input-wrapper]]:px-4",
  "[&_[data-slot=command-input]]:text-base [&_[data-slot=command-input]]:placeholder:text-foreground/50",
  // Group headings: a quiet label, not a caption in small print.
  "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-foreground/50",
  // Rows at reading size, with the selected one filled rather than ruled.
  "[&_[cmdk-item]]:gap-3 [&_[cmdk-item]]:rounded-lg [&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-2.5 [&_[cmdk-item]]:text-base",
  "[&_[cmdk-item][data-selected=true]]:bg-muted"
);

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset the query only AFTER the close animation, so the box keeps showing the
  // query + results while it fades out instead of flashing its empty state.
  const scheduleQueryReset = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setQuery(""), 220);
  };

  // If it reopens before the reset fires, cancel it so new typing survives.
  useEffect(() => {
    if (open && closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, [open]);

  // Global ⌘K / Ctrl+K toggle.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  // Debounced hybrid search.
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const handle = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}&type=all&limit=8`, {
        signal: controller.signal,
      })
        .then((r) => r.json())
        .then((d) => setResults(Array.isArray(d.results) ? d.results : []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 180);
    return () => {
      clearTimeout(handle);
      controller.abort();
    };
  }, [query]);

  const go = (href: string) => {
    setOpen(false);
    scheduleQueryReset();
    router.push(href);
  };

  const trimmed = query.trim();
  const seeAllHref = `/search?q=${encodeURIComponent(trimmed)}`;
  const groups: Hit["type"][] = ["block", "page", "piece", "component"];

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) scheduleQueryReset();
      }}
    >
      <DialogContent className="overflow-hidden rounded-2xl p-0 sm:max-w-xl" showCloseButton={false}>
        <DialogTitle className="sr-only">Search Beste UI</DialogTitle>
        <Command shouldFilter={false} className={COMMAND_CLASS}>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search blocks, pages, pieces, components…"
          />
          <CommandList>
            {!query && (
              <CommandGroup heading="Suggestions">
                {STATIC_NAV.map((item) => (
                  <CommandItem
                    key={item.href}
                    value={item.href}
                    onSelect={() => go(item.href)}
                    className="cursor-pointer"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Default-highlighted first item, so Enter opens the full results page. */}
            {trimmed && (
              <CommandGroup>
                <CommandItem
                  value="see-all-results"
                  onSelect={() => go(seeAllHref)}
                  className="cursor-pointer font-medium"
                >
                  <HugeiconsIcon icon={Search01Icon} size={20} strokeWidth={2} />
                  <span className="truncate">See all results for &ldquo;{trimmed}&rdquo;</span>
                  <CommandShortcut className="text-sm">↵</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            )}

            {groups.map((type) => {
              const items = results.filter((r) => r.type === type);
              if (items.length === 0) return null;
              return (
                <Fragment key={type}>
                  <CommandSeparator className="my-1" />
                  <CommandGroup heading={GROUP_LABEL[type]}>
                    {items.map((hit) => (
                      <CommandItem
                        key={hit.href}
                        value={hit.href}
                        onSelect={() => go(hit.href)}
                        className="cursor-pointer"
                      >
                        {TYPE_ICON[hit.type]}
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="flex items-center gap-2 truncate">
                            {hit.title}
                            {hit.isPro && <ProBadge />}
                          </span>
                          <span className="truncate text-sm text-foreground/50">
                            {hit.category} · {hit.name}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Fragment>
              );
            })}

            {trimmed && loading && results.length === 0 && (
              <div className="flex items-center gap-2 px-3 py-8 text-base text-foreground/50">
                <HugeiconsIcon icon={SparklesIcon} size={16} strokeWidth={2} className="animate-pulse" /> Searching…
              </div>
            )}

            {trimmed && !loading && results.length === 0 && (
              <div className="px-3 py-8 text-center text-base text-foreground/50">
                No matches. Press &crarr; to search the full catalog.
              </div>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
