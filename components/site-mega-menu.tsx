"use client";

import {
  Book02Icon,
  Bookmark02Icon,
  GiftIcon,
  Logout01Icon,
  Settings01Icon,
  SparklesIcon,
  TerminalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Button23 } from "@/components/beste/component/button23";
import { GitHubLogo } from "@/components/icons/github-logo";
import { XLogo } from "@/components/icons/x-logo";
import { ThemeSwitcher, type ThemeSwitcherValue } from "@/components/theme-switcher";
import {
  ACCOUNT_HREF,
  CHANGELOG_HREF,
  DOCS_HREF,
  DOCS_MCP_HREF,
  FAVORITES_HREF,
  PAGES_HREF,
  PRICING_HREF,
  REFERRALS_HREF,
  hostedLinkProps,
} from "@/lib/site-links";
import { cn } from "@/lib/utils";

const SECTIONS: { href: string; label: string; note: string; hosted?: boolean }[] = [
  { href: "/blocks", label: "Blocks", note: "Full sections, from heroes to footers" },
  { href: PAGES_HREF, label: "Pages", note: "Whole pages, composed from blocks", hosted: true },
  { href: "/pieces", label: "Pieces", note: "Live widgets that sit inside a block" },
  { href: "/components", label: "Components", note: "The primitives underneath it all" },
];

const RESOURCES: { href: string; label: string; note: string; icon: typeof Book02Icon }[] = [
  { href: CHANGELOG_HREF, label: "What's new?", note: "Every release, week by week", icon: SparklesIcon },
  { href: DOCS_HREF, label: "Docs", note: "Install, theme and own the code", icon: Book02Icon },
  { href: DOCS_MCP_HREF, label: "AI & MCP", note: "Let your agent pull blocks in", icon: TerminalIcon },
  { href: REFERRALS_HREF, label: "Referrals", note: "30% on every payment you bring", icon: GiftIcon },
];

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/**
 * A list whose hover is one gray pill that glides from row to row. The rows touch,
 * so there is no gap for the pointer to fall into; the pill only fades when the
 * pointer leaves the whole list, and it appears in place rather than sliding in.
 */
function HoverList({ inset, className, children }: { inset: string; className?: string; children: React.ReactNode }) {
  const list = React.useRef<HTMLUListElement>(null);
  const shown = React.useRef(false);
  const [pill, setPill] = React.useState<{ top: number; height: number; glide: boolean; visible: boolean }>({
    top: 0,
    height: 0,
    glide: false,
    visible: false,
  });

  const follow = (target: EventTarget) => {
    const row = (target as HTMLElement).closest<HTMLElement>("li[data-row]");
    if (!row || !list.current?.contains(row)) return;
    setPill({ top: row.offsetTop, height: row.offsetHeight, glide: shown.current, visible: true });
    shown.current = true;
  };
  const hide = () => {
    shown.current = false;
    setPill((current) => ({ ...current, visible: false }));
  };

  return (
    <ul
      ref={list}
      onPointerOver={(event) => follow(event.target)}
      onFocus={(event) => follow(event.target)}
      onPointerLeave={hide}
      onBlur={(event) => {
        if (!list.current?.contains(event.relatedTarget as Node)) hide();
      }}
      className={cn("relative flex flex-col", className)}
    >
      <li
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-0 rounded-2xl bg-muted motion-reduce:transition-none",
          inset,
          EASE,
          pill.glide ? "transition-[translate,height,opacity] duration-500" : "transition-opacity duration-300"
        )}
        style={{ translate: `0 ${pill.top}px`, height: pill.height, opacity: pill.visible ? 1 : 0 }}
      />
      {children}
    </ul>
  );
}

interface SiteMegaMenuProps {
  open: boolean;
  onClose: () => void;
  pathname: string;
  user?: { name?: string | null; email?: string | null } | null;
  hasPro: boolean;
  /** The reader's avatar, drawn by the header so the bar and the menu never drift apart. */
  avatar: React.ReactNode;
  onSignIn: () => void;
  onLogout: () => void;
  theme?: ThemeSwitcherValue;
  onThemeChange: (theme: ThemeSwitcherValue) => void;
  githubRepo: string;
}

/**
 * The desktop menu: a panel that drops from the bar into the hero's own frame, the
 * same width and the same corners, so on the home page it reads as the hero opening.
 * It stays mounted and hides with CSS, so its links are in the server HTML.
 */
export function SiteMegaMenu({
  open,
  onClose,
  pathname,
  user,
  hasPro,
  avatar,
  onSignIn,
  onLogout,
  theme,
  onThemeChange,
  githubRepo,
}: SiteMegaMenuProps) {
  const panel = React.useRef<HTMLDivElement>(null);

  // Escape closes it, as it would a dialog
  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Focus moves into the panel on open, so a keyboard reader lands on the first section
  React.useEffect(() => {
    if (open) panel.current?.querySelector<HTMLElement>("a, button")?.focus({ preventScroll: true });
  }, [open]);

  // Each column arrives a beat after the one before it; the caller's layout classes are merged in, not replaced
  const rise = (step: number, className: string) => ({
    className: cn(
      className,
      "transition-[opacity,translate] duration-700 motion-reduce:transition-none",
      EASE,
      open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
    ),
    style: { transitionDelay: open ? `${120 + step * 70}ms` : "0ms" },
  });

  return (
    <>
      {/* The page under the panel steps back; a click on it closes the menu */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 top-16 z-40 hidden bg-background/40 transition-opacity duration-500 lg:block",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      {/* The hidden panel still takes up its height, so the wrappers let clicks through and only the open panel catches them */}
      <div className="pointer-events-none absolute inset-x-0 top-full z-50 hidden lg:block">
        {/* No gap: the hero starts right under the bar, so the panel's top edge lines up with the hero's */}
        <div className="mx-auto max-w-6xl px-6">
          <div
            ref={panel}
            id="site-mega-menu"
            role="region"
            aria-label="Menu"
            inert={!open}
            className={cn(
              "origin-top transition-[opacity,translate,visibility] duration-500 motion-reduce:transition-none",
              EASE,
              open ? "pointer-events-auto visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
            )}
          >
            <div className="overflow-hidden rounded-3xl border border-border/60 bg-background">
            <div className="grid grid-cols-12 gap-10 p-10">
              {/* The four catalogues, large: the reason anyone opens this */}
              <nav aria-label="Browse" {...rise(0, "col-span-4")}>
                <p className="text-sm text-muted-foreground">Browse</p>
                <HoverList inset="-inset-x-4" className="mt-3">
                  {SECTIONS.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <li key={item.href} data-row="">
                        <Link
                          href={item.href}
                          {...(item.hosted ? hostedLinkProps : {})}
                          onClick={onClose}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "group/section relative -mx-4 flex cursor-pointer items-center justify-between gap-6 rounded-2xl px-4 py-3 outline-none"
                          )}
                        >
                          <span className="min-w-0">
                            <span
                              className={cn(
                                "block text-3xl font-medium tracking-[-0.03em] transition-colors duration-500 group-hover/section:text-foreground group-focus-visible/section:text-foreground",
                                active ? "text-foreground" : "text-foreground/70"
                              )}
                            >
                              {item.label}
                            </span>
                            <span
                              className={cn(
                                "mt-1 block text-sm text-muted-foreground"
                              )}
                            >
                              {item.note}
                            </span>
                          </span>
                          <span
                            className={cn(
                              "flex size-10 shrink-0 items-center justify-center rounded-full bg-muted transition-colors duration-500 group-hover/section:bg-background group-focus-visible/section:bg-background"
                            )}
                          >
                            <ArrowUpRight
                              className="size-4"
                              aria-hidden="true"
                            />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </HoverList>
              </nav>

              {/* Everything around the catalogues */}
              <nav aria-label="Resources" {...rise(1, "col-span-4")}>
                <p className="text-sm text-muted-foreground">Resources</p>
                <HoverList inset="-inset-x-3" className="mt-3">
                  {RESOURCES.map((item) => (
                    <li key={item.href} data-row="">
                      <Link
                        href={item.href}
                        {...hostedLinkProps}
                        onClick={onClose}
                        className={cn(
                          "group/resource relative -mx-3 flex cursor-pointer items-start gap-3 rounded-2xl px-3 py-2.5 focus-visible:outline-none"
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted transition-colors duration-500 group-hover/resource:bg-background group-focus-visible/resource:bg-background"
                          )}
                        >
                          <HugeiconsIcon icon={item.icon} size={16} strokeWidth={2} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium">{item.label}</span>
                          <span className="block text-sm text-muted-foreground">{item.note}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </HoverList>
                <div className="mt-5 flex items-center gap-2 border-t border-border/60 pt-5">
                  <a
                    href={`https://github.com/${githubRepo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Star on GitHub"
                    className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-muted transition-colors duration-500 hover:bg-muted-foreground/15"
                  >
                    <GitHubLogo width={16} height={16} />
                  </a>
                  <a
                    href="https://x.com/withbeste"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow on X"
                    className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-muted transition-colors duration-500 hover:bg-muted-foreground/15"
                  >
                    <XLogo className="size-4" />
                  </a>
                </div>
              </nav>

              {/* The reader: a way into Pro, then who they are and how the site looks */}
              <div {...rise(2, "col-span-4 flex flex-col gap-4")}>
                <Link
                  href={hasPro ? CHANGELOG_HREF : PRICING_HREF}
                  {...hostedLinkProps}
                  onClick={onClose}
                  className="group/pro relative isolate flex min-h-52 cursor-pointer flex-col justify-end overflow-hidden rounded-2xl p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1793571737300-407dcf2a831b?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                    alt=""
                    fill
                    sizes="400px"
                    // The photo is tall: anchored at the bottom, the dark land sits under the copy and the glow above it
                    className={cn("-z-10 object-cover object-bottom transition-transform duration-1000 group-hover/pro:scale-105", EASE)}
                  />
                  <span className="text-2xl font-medium tracking-[-0.03em] text-white">
                    {hasPro ? "You have Pro" : "Beste Pro"}
                  </span>
                  <span className="mt-1 max-w-64 text-sm text-white/80">
                    {hasPro
                      ? "See what landed in the library this week."
                      : "Every block, piece and page, with the full source and a commercial license."}
                  </span>
                  {/* The whole card is the link, so the button is drawn as a span inside it */}
                  <span className="mt-5">
                    <Button23 size="sm" tone="light" label={hasPro ? "What's new" : "See plans"} asChild>
                      <span />
                    </Button23>
                  </span>
                </Link>

                <div className="rounded-2xl bg-muted/70 p-4">
                  {user ? (
                    <div className="flex items-center gap-3">
                      {avatar}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {user.name || user.email?.split("@")[0] || "Anonymous"}
                        </span>
                        {user.email && <span className="block truncate text-sm text-muted-foreground">{user.email}</span>}
                      </span>
                      <span className="flex items-center gap-1">
                        {[
                          { href: FAVORITES_HREF, label: "Favorites", icon: Bookmark02Icon },
                          { href: ACCOUNT_HREF, label: "Account", icon: Settings01Icon },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            {...hostedLinkProps}
                            onClick={onClose}
                            aria-label={item.label}
                            title={item.label}
                            className="flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-background"
                          >
                            <HugeiconsIcon icon={item.icon} size={16} strokeWidth={2} />
                          </Link>
                        ))}
                        <button
                          type="button"
                          onClick={onLogout}
                          aria-label="Logout"
                          title="Logout"
                          className="flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-background"
                        >
                          <HugeiconsIcon icon={Logout01Icon} size={16} strokeWidth={2} />
                        </button>
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-muted-foreground">Sign in to keep favorites and unlock Pro.</span>
                      <Button23 size="sm" tone="dark" label="Sign in" onClick={onSignIn} className="shrink-0" />
                    </div>
                  )}
                  <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <ThemeSwitcher value={theme} onChange={onThemeChange} />
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
