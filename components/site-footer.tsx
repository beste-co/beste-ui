import {
  BLOG_HREF,
  CHANGELOG_HREF,
  DOCS_HREF,
  DOCS_MCP_HREF,
  PAGES_HREF,
  PRICING_HREF,
  REFERRALS_HREF,
  TOOLS_HREF,
  hostedLinkProps,
} from "@/lib/site-links";

import { Badge7 } from "@/components/beste/component/badge7";
import { BesteLogo } from "@/components/icons/beste-logo";
import { BesteText } from "@/components/icons/beste-text";
import { Button12 } from "@/components/beste/component/button12";
import { GitHubLogo } from "@/components/icons/github-logo";
import Link from "next/link";
import { LinkedInLogo } from "@/components/icons/linkedin-logo";
import { XLogo } from "@/components/icons/x-logo";

const COLUMNS: {
  title: string;
  links: {
    label: string;
    href: string;
    external?: boolean;
    /** Lives on the hosted site, so it may point off this deployment. */
    hosted?: boolean;
  }[];
}[] = [
  {
    title: "Library",
    links: [
      { label: "Blocks", href: "/blocks" },
      { label: "Pages", href: PAGES_HREF, hosted: true },
      { label: "Pieces", href: "/pieces" },
      { label: "Components", href: "/components" },
      { label: "Search", href: "/search" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Docs", href: DOCS_HREF, hosted: true },
      { label: "AI & MCP", href: DOCS_MCP_HREF, hosted: true },
      { label: "Blog", href: BLOG_HREF, hosted: true },
      { label: "Free tools", href: TOOLS_HREF, hosted: true },
      { label: "What's new?", href: CHANGELOG_HREF, hosted: true },
      { label: "Website Builder", href: "https://beste.co", external: true },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Pricing", href: PRICING_HREF, hosted: true },
      { label: "Referrals", href: REFERRALS_HREF, hosted: true },
      { label: "License", href: "/license" },
      { label: "GitHub", href: "https://github.com/beste-co/beste-ui", external: true },
    ],
  },
];

/**
 * The catalogue's own categories, spelled the way someone searching for them would.
 *
 * The twenty largest, four columns of five: every one of these is a real page with
 * real blocks behind it, because a footer full of links to categories that turn out
 * to be empty is the kind of thing a reader only checks once.
 */
const BLOCK_CATEGORIES: { label: string; href: string }[][] = [
  [
    { label: "Shadcn Hero Blocks", href: "/blocks/hero" },
    { label: "Shadcn Feature Blocks", href: "/blocks/feature" },
    { label: "Shadcn Pricing Blocks", href: "/blocks/pricing" },
    { label: "Shadcn CTA Blocks", href: "/blocks/cta" },
    { label: "Shadcn FAQ Blocks", href: "/blocks/faq" },
  ],
  [
    { label: "Shadcn About Blocks", href: "/blocks/about" },
    { label: "Shadcn Stats Blocks", href: "/blocks/stats" },
    { label: "Shadcn Footer Blocks", href: "/blocks/footer" },
    { label: "Shadcn Navigation Blocks", href: "/blocks/navigation" },
    { label: "Shadcn Auth Blocks", href: "/blocks/auth" },
  ],
  [
    { label: "Shadcn Ecommerce Blocks", href: "/blocks/ecommerce" },
    { label: "Shadcn Portfolio Blocks", href: "/blocks/portfolio" },
    { label: "Shadcn Showcase Blocks", href: "/blocks/showcase" },
    { label: "Shadcn Careers Blocks", href: "/blocks/careers" },
    { label: "Shadcn Onboarding Blocks", href: "/blocks/onboarding" },
  ],
  [
    { label: "Shadcn Coming Soon Blocks", href: "/blocks/coming-soon" },
    { label: "Shadcn Post Blocks", href: "/blocks/post" },
    { label: "Shadcn Legal Blocks", href: "/blocks/legal" },
    { label: "Shadcn Workflow Blocks", href: "/blocks/workflow" },
    { label: "Shadcn News Blocks", href: "/blocks/news" },
  ],
];

/**
 * The site footer, in footer104's shape and the Auralis set's language: a lead panel
 * beside the link columns, a parenthetical eyebrow over a bold heading, seal buttons.
 *
 * What footer104 leads with is a subscribe form, and that is the one thing not
 * carried over: there is no newsletter behind this site, and a field that takes an
 * address and does nothing with it is worse than no field. The invitation in its
 * place is one this site can actually keep.
 */
export function SiteFooter() {
  return (
    <footer className="bg-background py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Lead */}
          <div className="max-w-md">
            <Link href="/" aria-label="Beste UI home" className="flex items-center text-[#FF7322]">
              <BesteLogo width={24} height={24} color="currentColor" />
              <BesteText height={16} className="text-foreground" />
            </Link>

            <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Ship the interface, keep the code.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              New blocks, pieces and components every week. Install one with a command and it is
              yours to edit. No runtime dependency, no upgrade path to fight.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button12 asChild label="Browse the library">
                <Link href="/blocks" />
              </Button12>
              <Button12 asChild label="See pricing" tone="outline">
                <Link href={PRICING_HREF} {...hostedLinkProps} />
              </Button12>
            </div>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:justify-items-end">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="text-base font-bold tracking-tight text-foreground">
                  {column.title}
                </h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          className="text-base text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          {...(link.hosted ? hostedLinkProps : {})}
                          className="text-base text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/*
          One heading over three columns rather than three headings: it is one idea
          (the categories), and repeating "Shadcn Blocks" above each column would only
          be the layout talking.
        */}
        <div className="mt-14 border-t pt-10">
          <h3 className="text-base font-bold tracking-tight text-foreground">Shadcn Blocks</h3>
          <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
            {BLOCK_CATEGORIES.map((column) => (
              <ul key={column[0]?.href} className="flex flex-col gap-3">
                {column.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-base text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t pt-8 md:flex-row md:items-center md:justify-between">
          {/* The same round controls the header uses, so the two ends of the page
              agree about what a small action looks like. */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/beste-co/beste-ui"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Beste UI on GitHub"
              className="flex size-10 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <GitHubLogo width={18} height={18} />
            </a>
            <a
              href="https://x.com/withbeste"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Beste UI on X"
              className="flex size-10 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <XLogo className="size-4" />
            </a>
            <a
              href="https://linkedin.com/company/bestestudio"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Beste UI on LinkedIn"
              className="flex size-10 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LinkedInLogo width={18} height={18} />
            </a>
          </div>

          {/*
            No year: this renders inside a client tree, and `new Date()` there is the
            browser's clock rather than the server's — one night a year the two would
            disagree and React would report it. A line without a year is true on both.
          */}
          <p className="text-base text-muted-foreground">
            © 2026,{" "}
            <a href="https://beste.co" className="text-foreground hover:underline">
              Beste
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
