"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface DocsSection {
  /** The id on the section this points at. */
  id: string;
  label: string;
}

export interface DocsSponsor {
  name: string;
  href: string;
  /** One line about them. Shown under the name. */
  blurb?: string;
  /** Square-ish logo. Left out, the first letter stands in for it. */
  logo?: string;
}

interface DocsSideRailProps {
  sections: DocsSection[];
  sponsors?: DocsSponsor[];
  /** Where a sponsor slot is bought. Leaving it out drops the invitation. */
  sponsorHref?: string;
  className?: string;
}

/**
 * Which section the reader is in.
 *
 * An observer rather than a scroll handler: the browser already knows what is on
 * screen, and asking it costs nothing per frame. The top band is narrowed to the
 * first fifth of the window so a heading counts as current when it reaches the top
 * of the reading area, not when it happens to be visible at the bottom of a tall
 * screen.
 */
function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = React.useState<string | null>(ids[0] ?? null);

  React.useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const seen = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) seen.set(entry.target.id, entry.isIntersecting);
        // The first section still on screen wins, so the rail reads top-down the
        // way the page does.
        const current = ids.find((id) => seen.get(id));
        if (current) setActive(current);
      },
      { rootMargin: "0px 0px -80% 0px", threshold: 0 },
    );

    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));
    for (const node of nodes) observer.observe(node);

    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/**
 * The right-hand rail: where the reader is, and who paid for the page.
 *
 * It is 200px and it is sticky, which is the whole design. A table of contents that
 * scrolls away with the content is a table of contents that is only useful before
 * you start reading.
 */
export function DocsSideRail({ sections, sponsors, sponsorHref, className }: DocsSideRailProps) {
  const ids = React.useMemo(() => sections.map((section) => section.id), [sections]);
  const active = useActiveSection(ids);

  /**
   * Scroll rather than jump.
   *
   * Handled here rather than with `scroll-behavior: smooth` on the document: that
   * would apply to every anchor on the site, including the ones a router restores
   * after a navigation, where a slow glide across the page is exactly wrong. It also
   * cannot be told about `prefers-reduced-motion` without a second rule, and this can
   * simply ask.
   *
   * The link stays a real link with a real href, so it opens in a new tab, copies as
   * a URL and works before this handler is attached; the handler only takes over when
   * it can do better. `scroll-mt-8` on each section is what keeps the heading off the
   * top edge, since scroll margin is honoured by `scrollIntoView` too.
   */
  const handleJump = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    // Anything but a plain left click is the reader asking for a new tab or window.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    const node = document.getElementById(id);
    if (!node) return;

    event.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });

    // The URL still ends up shareable, but written rather than navigated to, which is
    // what would have jumped.
    window.history.replaceState(null, "", `#${id}`);

    /*
     * And the keyboard follows the eye: without this, Tab after a jump carries on
     * from the rail, several sections above whatever the reader just moved to.
     */
    node.setAttribute("tabindex", "-1");
    node.focus({ preventScroll: true });
  };

  return (
    <aside className={cn("flex w-[200px] shrink-0 flex-col gap-8", className)}>
      {sections.length > 0 ? (
        <nav aria-label="On this page" className="flex flex-col gap-2">
          <span className="text-base font-medium text-foreground">On this page</span>
          <ul className="flex flex-col gap-0.5 border-l">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(event) => handleJump(event, section.id)}
                  aria-current={active === section.id ? "location" : undefined}
                  className={cn(
                    "-ml-px block border-l py-1 pl-3 text-base transition-colors",
                    active === section.id
                      ? "border-foreground font-medium text-foreground"
                      : "border-transparent text-foreground/70 hover:border-border hover:text-foreground",
                  )}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {sponsors && sponsors.length > 0 ? (
        <div className="flex flex-col gap-2">
          <span className="text-base font-medium text-foreground">Sponsors</span>
          <ul className="flex flex-col gap-2">
            {sponsors.map((sponsor) => (
              <li key={sponsor.name}>
                <a
                  href={sponsor.href}
                  target="_blank"
                  rel="noreferrer sponsored"
                  className="flex items-start gap-2 rounded-lg border p-2 transition-colors hover:bg-muted"
                >
                  {sponsor.logo ? (
                    // Not next/image: a sponsor's logo is an arbitrary remote URL, and
                    // the loader would need every one of their hosts configured.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sponsor.logo}
                      alt=""
                      aria-hidden="true"
                      className="size-8 shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-base font-medium text-foreground/70"
                    >
                      {sponsor.name.charAt(0)}
                    </span>
                  )}
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-base font-medium text-foreground">
                      {sponsor.name}
                    </span>
                    {sponsor.blurb ? (
                      <span className="line-clamp-2 text-base text-foreground/70">
                        {sponsor.blurb}
                      </span>
                    ) : null}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* {sponsorHref ? (
        <a
          href={sponsorHref}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "flex items-center justify-center rounded-lg border border-dashed p-3 text-base",
            "text-foreground/70 transition-colors hover:border-border hover:bg-muted hover:text-foreground",
          )}
        >
          {sponsors && sponsors.length > 0 ? "Sponsor this page" : "Your logo here"}
        </a>
      ) : null} */}
    </aside>
  );
}
