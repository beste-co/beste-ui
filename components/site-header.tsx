"use client";

import {
  Book02Icon,
  Bookmark02Icon,
  Cancel01Icon,
  CrownIcon,
  GiftIcon,
  Logout01Icon,
  Menu01Icon,
  Search01Icon,
  Settings01Icon,
  SparklesIcon,
  TerminalIcon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";
import { Button23 } from "@/components/beste/component/button23";
import { BesteLogo } from "@/components/icons/beste-logo";
import { BesteText } from "@/components/icons/beste-text";
import { GitHubLogo } from "@/components/icons/github-logo";
import { XLogo } from "@/components/icons/x-logo";
import { LoginModal } from "@/components/login-modal";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Kbd } from "@/components/ui/kbd";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { authClient } from "@/lib/auth.client";
import { useAuth } from "@/lib/auth-context";
import { useCommandPalette } from "@/lib/command-palette-store";
import { generateGradient } from "@/lib/generate-avatar";
import { useLicense } from "@/lib/license-context";
import {
  ACCOUNT_HREF,
  CHANGELOG_HREF,
  DOCS_HREF,
  DOCS_MCP_HREF,
  FAVORITES_HREF,
  PAGES_HREF,
  PRICING_HREF,
  REFERRALS_HREF,
  TOOLS_HREF,
  hostedLinkProps,
} from "@/lib/site-links";
import { cn } from "@/lib/utils";

/**
 * The bar's own links: the four things you can browse. Everything else lives in
 * the menu, and the blog lives in the footer — the bar's last slot pays for
 * itself better as the Pro call to action.
 */
const NAV: { href: string; label: string; hosted?: boolean }[] = [
  { href: "/blocks", label: "Blocks" },
  { href: PAGES_HREF, label: "Pages", hosted: true },
  { href: "/pieces", label: "Pieces" },
  { href: "/components", label: "Components" },
];

/** The rest, shown in the menu and in the mobile panel. */
const MORE: {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  /** Lives on the hosted site, so it may point off this deployment. */
  hosted?: boolean;
}[] = [
  { href: CHANGELOG_HREF, label: "What's new?", icon: <HugeiconsIcon icon={SparklesIcon} size={16} strokeWidth={2} />, hosted: true },
  { href: DOCS_HREF, label: "Docs", icon: <HugeiconsIcon icon={Book02Icon} size={16} strokeWidth={2} />, hosted: true },
  { href: DOCS_MCP_HREF, label: "AI & MCP", icon: <HugeiconsIcon icon={TerminalIcon} size={16} strokeWidth={2} />, hosted: true },
  { href: TOOLS_HREF, label: "Free tools", icon: <HugeiconsIcon icon={Wrench01Icon} size={16} strokeWidth={2} />, hosted: true },
  { href: REFERRALS_HREF, label: "Referrals", icon: <HugeiconsIcon icon={GiftIcon} size={16} strokeWidth={2} />, hosted: true },
];

const GITHUB_REPO = "beste-co/beste-ui";

/**
 * The repository, as one round control. It used to fetch its own star count and
 * grow into a pill for it; the number changed the width of the bar depending on
 * whether GitHub's API answered, which is a lot of movement for a figure nobody
 * came here to read.
 */
function GitHubLink() {
  return (
    <a
      href={`https://github.com/${GITHUB_REPO}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Beste UI on GitHub"
      title="GitHub"
      className="hidden size-9 shrink-0 items-center justify-center rounded-full bg-muted/60 text-foreground transition-colors hover:bg-muted sm:flex"
    >
      <GitHubLogo width={16} height={16} />
    </a>
  );
}

function initials(name?: string | null, email?: string | null) {
  if (name) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return email ? email.charAt(0).toUpperCase() : "U";
}

/**
 * The site's top bar, in the shape navbar68 gave the catalogue: a tall bar, the
 * search as the centrepiece rather than an afterthought in the corner, the sections
 * on the right, and one round control that opens everything else.
 *
 * What it does not carry, on purpose: the old bar's hand-animated logo spin (sixty
 * lines of Web Animations code for a hover), and its ProUnlockModal, which nothing
 * in it ever opened.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const { session, refreshSession } = useAuth();
  const { hasPro } = useLicense();
  const { setOpen: setCommandOpen } = useCommandPalette();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [avatarGradient, setAvatarGradient] = React.useState<{
    fromColor: string;
    toColor: string;
  } | null>(null);
  const [avatarBroken, setAvatarBroken] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  // The mobile panel is part of the page, not a route: a navigation has to close it.
  React.useEffect(() => setMenuOpen(false), [pathname]);

  const user = session?.user;

  React.useEffect(() => {
    if (user?.email) generateGradient(user.email).then(setAvatarGradient);
    setAvatarBroken(false);
  }, [user?.email]);

  const logout = React.useCallback(async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
    // Better-auth cookies outlive signOut() when the request fails; clearing them
    // here is what makes a failed logout still look like a logout.
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.split("=")[0]?.trim();
      if (name?.startsWith("better-auth")) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    }
    window.location.href = "/";
  }, []);

  /**
   * The reader's face when there is one and a monogram when there is not, at the size
   * the caller asks for: the bar wants a small one, the panel a large one, and drawing
   * it twice is how the two quietly drift apart.
   */
  const avatar = (className: string) =>
    user?.image && !avatarBroken ? (
      // Not next/image: an avatar comes from whichever provider the reader signed in
      // with, and the loader wants every host listed up front.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.image}
        alt=""
        onError={() => setAvatarBroken(true)}
        className={cn("rounded-full object-cover", className)}
      />
    ) : (
      <span
        className={cn(
          "flex items-center justify-center rounded-full font-medium text-white",
          className,
        )}
        style={{
          background: avatarGradient
            ? `linear-gradient(135deg, ${avatarGradient.fromColor}, ${avatarGradient.toColor})`
            : "linear-gradient(135deg, #FF7322, #f5af19)",
        }}
      >
        {initials(user?.name, user?.email)}
      </span>
    );

  /*
   * The search is a button wearing a field: the real thing is the ⌘K palette, and a
   * second input that has to hand its text over would only be a slower way in.
   */
  const search = (
    <button
      type="button"
      onClick={() => setCommandOpen(true)}
      className="group/search flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-full bg-muted/60 pl-4 pr-1.5 text-left transition-colors hover:bg-muted"
    >
      <HugeiconsIcon icon={Search01Icon} size={14} strokeWidth={2} className="shrink-0 text-foreground/50" aria-hidden="true" />
      <span className="w-full text-sm text-foreground/50">Search blocks, pieces and components…</span>
      <span className="flex h-7 shrink-0 items-center gap-1 rounded-full bg-background px-2">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </span>
    </button>
  );

  return (
    <>
      {/* Chrome, not content: the Markdown rendition drops it and opens with
          the site preamble instead. See lib/html-to-markdown.ts. */}
      <header data-md-omit="" className="w-full border-b bg-background">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-5 px-4 md:px-6">
          <Link
            href="/"
            aria-label="Beste UI home"
            className="flex shrink-0 items-center gap-0 text-[#FF7322]"
          >
            <BesteLogo width={24} height={24} color="currentColor" />
            <BesteText height={16} className="text-foreground" />
          </Link>

          <div className="hidden max-w-md flex-1 md:block">{search}</div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-5 lg:flex">
              {NAV.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    {...(item.hosted ? hostedLinkProps : {})}
                    aria-current={active ? "page" : undefined}
                    // Text8's line, drawn on hover instead of on view; the current section keeps it.
                    className={cn(
                      "relative cursor-pointer text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:bg-current after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:after:scale-x-100 motion-reduce:after:transition-none",
                      active ? "text-foreground after:scale-x-100" : "text-foreground/70 after:scale-x-0 hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/*
              The round controls are one cluster: GitHub, search on a phone, and the
              menu. A nav-sized gap between them would read as three separate things
              rather than one set of controls at the end of the bar.
            */}
            <div className="flex items-center gap-1.5">
              <GitHubLink />

              {/* Mobile: one control opens the search, since the field itself is hidden. */}
              <button
                type="button"
                aria-label="Search"
                onClick={() => setCommandOpen(true)}
                className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-muted/60 text-foreground transition-colors hover:bg-muted md:hidden"
              >
                <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={2} />
              </button>

              {/*
                One control at every width now, and it opens a panel rather than a
                popover: a fourteen-rem dropdown was the weakest thing in the bar, and
                the sections, the account and the theme all had to whisper to fit it.
              */}
              <button
                type="button"
                aria-label="Menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(true)}
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-muted/60 text-foreground transition-colors hover:bg-muted"
              >
                {/*
                  The avatar keeps a margin inside the 36px control: edge to edge
                  it reads larger than the GitHub mark beside it.
                */}
                {user ? (
                  avatar("size-7 text-xs")
                ) : (
                  <HugeiconsIcon icon={Menu01Icon} size={16} strokeWidth={2} />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/*
        The menu, as a panel from the right. It carries what the dropdown carried and
        what the mobile sheet carried, in one place: the sections at a size worth
        reading, then everything around them.

        The search is not in here. It opens the command palette, which is itself a
        dialog, and a dialog opened from a dialog leaves two overlays fighting over
        the same escape key. The bar keeps its own search control for that.
      */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="right"
          // No description in this panel, and Radix asks about that unless it is told.
          aria-describedby={undefined}
          className="w-full gap-0 overflow-y-auto p-0 sm:max-w-md"
        >
          <SheetTitle className="sr-only">Menu</SheetTitle>

          <div className="flex items-center justify-between border-b px-6 py-5">
            <Link
              href="/"
              aria-label="Beste UI home"
              className="flex shrink-0 items-center text-[#FF7322]"
            >
              <BesteLogo width={24} height={24} color="currentColor" />
              <BesteText height={16} className="text-foreground" />
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-muted/60 text-foreground transition-colors hover:bg-muted"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={2} />
            </button>
          </div>

          {/* Who the reader is, or the one thing they can do about it. */}
          {user ? (
            <Link
              href={ACCOUNT_HREF}
              {...hostedLinkProps}
              className="flex items-center gap-3 border-b px-6 py-5 transition-colors hover:bg-muted"
            >
              {avatar("size-11 text-base")}
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 truncate text-base font-medium">
                  {user.name || user.email?.split("@")[0] || "Anonymous"}
                  {hasPro && (
                    <HugeiconsIcon
                      icon={CrownIcon}
                      size={16}
                      strokeWidth={2}
                      className="shrink-0 text-teal-600"
                    />
                  )}
                </span>
                {user.email && (
                  <span className="block truncate text-base text-foreground/70">{user.email}</span>
                )}
              </span>
            </Link>
          ) : (
            <div className="border-b px-6 py-5">
              <p className="text-base text-foreground/70">
                Sign in to keep favourites and unlock the Pro library.
              </p>
              <Button23
                tone="dark"
                label="Sign in"
                onClick={() => {
                  setMenuOpen(false);
                  setLoginOpen(true);
                }}
                className="mt-4 w-full justify-between"
              />
            </div>
          )}

          {/* The sections, at the size the mobile panel gave them. */}
          <div className="flex flex-col gap-5 px-6 py-6">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  {...(item.hosted ? hostedLinkProps : {})}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "cursor-pointer text-xl font-medium tracking-tight transition-colors",
                    active ? "text-foreground" : "text-foreground/70 hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col gap-4 border-t px-6 py-6">
            {/*
              Anyone without a licence gets the way to one, signed in or not: a
              reader who has not signed in is the likeliest person in the panel to
              want the price, and it used to be the one person it was hidden from.
              The wording follows who is asking — you cannot upgrade an account
              you do not have yet.
            */}
            {!hasPro && (
              <Link
                href={PRICING_HREF}
                {...hostedLinkProps}
                className="flex items-center justify-between text-base font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                {user ? "Upgrade to Pro" : "Pricing"}
                <HugeiconsIcon icon={CrownIcon} size={16} strokeWidth={2} />
              </Link>
            )}

            {MORE.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                {...(item.hosted ? hostedLinkProps : {})}
                className="flex items-center justify-between text-base font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                <span className="flex items-center gap-2">
                  {item.label}
                  {item.badge && (
                    <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium uppercase leading-none tracking-wide text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </span>
                {item.icon}
              </Link>
            ))}

            <a
              href={`https://github.com/${GITHUB_REPO}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between text-base font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              Star on GitHub
              <GitHubLogo width={16} height={16} />
            </a>
            <a
              href="https://x.com/withbeste"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between text-base font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              Follow on X
              <XLogo className="size-4" />
            </a>
          </div>

          {user && (
            <div className="flex flex-col gap-4 border-t px-6 py-6">
              <Link
                href={FAVORITES_HREF}
                {...hostedLinkProps}
                className="flex items-center justify-between text-base font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                Favorites
                <HugeiconsIcon icon={Bookmark02Icon} size={16} strokeWidth={2} />
              </Link>
              <Link
                href={ACCOUNT_HREF}
                {...hostedLinkProps}
                className="flex items-center justify-between text-base font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                Account
                <HugeiconsIcon icon={Settings01Icon} size={16} strokeWidth={2} />
              </Link>
              <button
                type="button"
                onClick={logout}
                className="flex cursor-pointer items-center justify-between text-base font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                Logout
                <HugeiconsIcon icon={Logout01Icon} size={16} strokeWidth={2} />
              </button>
            </div>
          )}

          <div className="mt-auto flex items-center justify-between border-t px-6 py-5">
            <span className="text-base font-medium text-foreground/70">Theme</span>
            <ThemeSwitcher
              value={mounted ? (theme as "light" | "dark" | "paper") : undefined}
              onChange={setTheme}
            />
          </div>
        </SheetContent>
      </Sheet>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} onLoginSuccess={refreshSession} />
    </>
  );
}
