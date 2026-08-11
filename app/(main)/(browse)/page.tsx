import type { Metadata } from "next";
import Link from "next/link";
import { Button12 } from "@/components/beste/component/button12";
import { BlocksGrid } from "@/components/blocks-grid";
import { ComponentDemo } from "@/components/component-demo";
import { HomeHero } from "@/components/home-hero";
import { HomeHeroSearch } from "@/components/home-hero-search";
import { HomeWhy } from "@/components/home-why";
import { RegistryComponentDemo } from "@/components/registry-component-demo";
import { changelog } from "@/data/changelog";
import { STUDIO_SET_BLOCKS } from "@/lib/block-sets";
import { blocksObfuscated as blocks } from "@/lib/blocks-obfuscated";
import { recentBlockDates } from "@/lib/changelog-dates";
import { components as allComponents } from "@/lib/components";
import { registryComponents } from "@/lib/registry-components";
import { Cta69 } from "@/registry/cta69/cta69";
import { Faq77 } from "@/registry/faq77/faq77";
import { Feature230 } from "@/registry/feature230/feature230";

const SITE_TITLE = "Beste UI - Production-ready shadcn/tailwind blocks & components";
const SITE_DESCRIPTION =
  "A curated collection of React blocks and components built with Tailwind CSS and shadcn/ui. Copy, install, and ship beautiful interfaces with confidence.";
const CANONICAL = "https://ui.beste.co/";
const OG_IMAGE = `https://ui.beste.co/og?title=${encodeURIComponent(
  "Beste UI"
)}&description=${encodeURIComponent(SITE_DESCRIPTION)}`;

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    url: CANONICAL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 628 }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

// Seeded random so the rotating preview is stable for a given seed
function seededShuffle<T>(array: readonly T[], seed: number): T[] {
  const result = [...array];
  let currentSeed = seed;
  const random = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233281;
    return currentSeed / 233280;
  };
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = result[i];
    const swap = result[j];
    if (temp !== undefined && swap !== undefined) {
      result[i] = swap;
      result[j] = temp;
    }
  }
  return result;
}

// Rotates every 3 hours so the homepage stays fresh without re-deploys
function getRotatingSeed(): number {
  const now = new Date();
  const threeHourBlock = Math.floor(now.getUTCHours() / 3);
  return (
    now.getUTCFullYear() * 1000000 +
    (now.getUTCMonth() + 1) * 10000 +
    now.getUTCDate() * 100 +
    threeHourBlock
  );
}

function pickSix<T extends { category: string }>(
  items: readonly T[],
  seed: number,
  category: string | null
): T[] {
  if (category) {
    const filtered = items.filter((i) => i.category === category);
    return seededShuffle(filtered, seed).slice(0, 6);
  }
  const byCategory = new Map<string, T[]>();
  for (const item of items) {
    const arr = byCategory.get(item.category) ?? [];
    arr.push(item);
    byCategory.set(item.category, arr);
  }
  const cats = Array.from(byCategory.keys());
  const shuffledCats = seededShuffle(cats, seed);
  const picked: T[] = [];
  for (const cat of shuffledCats) {
    const pool = byCategory.get(cat);
    if (pool && pool.length) {
      const top = seededShuffle(pool, seed + picked.length)[0];
      if (top) picked.push(top);
    }
    if (picked.length === 6) break;
  }
  return picked;
}

const FAQS = [
  {
    q: "What is Beste UI?",
    a: "Beste UI is a curated collection of React blocks and components built with Tailwind CSS and shadcn/ui. Every piece is self-contained, accessible, and designed to be copied into your codebase and customized to match your project. You own the source after you install it, so there is no runtime dependency on Beste and no upgrade path to fight through.",
  },
  {
    q: "How do I install a block or component?",
    a: "Every block and component ships with a one-line install command that uses the shadcn CLI. Pick the package manager you use (npm, pnpm, yarn, or bun) from the dropdown next to the command, click the command to copy it, and paste it into your terminal from the project root. The CLI writes the files into your components directory, registers any shadcn primitives it depends on, and installs the required npm packages for you.",
  },
  {
    q: "Do I need an account to copy code?",
    a: "No account is required for free blocks and components. You can copy the install command or the source directly and use it in any project. Pro blocks require a Beste UI license, which you can purchase from the Pricing page. Once you sign in with the email on your license, the install command on Pro blocks is automatically upgraded to include your license key so the CLI can fetch the unobfuscated source.",
  },
  {
    q: "What is the difference between Blocks and Pieces?",
    a: "Blocks are full page sections such as heroes, feature grids, pricing tables, testimonials, and CTAs. They are designed to drop directly into a page and look complete without additional styling. Pieces are smaller composable widgets such as URL pills, status indicators, and mini cards. They are meant to live inside a block or wherever you want a small, reusable piece of UI.",
  },
  {
    q: "Can I use these in commercial projects?",
    a: "Yes. Free blocks and components are MIT licensed, so you can use them in commercial client work, internal tools, and products without additional permission. Pro blocks include a commercial license that covers unlimited projects for the purchasing individual or team. Redistribution of Pro source in a public template or competing registry is not allowed.",
  },
  {
    q: "Which frameworks and stacks are supported?",
    a: "Every piece is a plain React component written for React 19, so it works wherever React runs: Next.js, Astro, TanStack Start, Remix, Vite, and more. Tailwind CSS v4 and the shadcn/ui primitives are the only required dependencies. Each block also ships in two flavors, a Radix variant and a Base UI variant, so you can match your stack. The install command assumes a project already initialized with shadcn (run `npx shadcn@latest init` once if you have not).",
  },
  {
    q: "How often are new blocks and components added?",
    a: "The registry grows weekly. New additions are announced on the Changelog page and on X. If you have ideas for a block or category you want to see covered, open an issue on GitHub or reach out on X. Popular requests make their way into the registry.",
  },
  {
    q: "Do the Pro blocks work offline or after my license expires?",
    a: "Yes. Once the shadcn CLI has copied the files into your project, the code lives in your repository and works the same as any other file you wrote. Your license unlocks future downloads and updates, but existing installs keep working even if you let your license lapse.",
  },
  {
    q: "Is there a referral program?",
    a: "Yes. Every account gets a referral link and earns 15% commission whenever someone you refer upgrades to Pro. You can copy your link and track your referrals and earnings on the Referrals page.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: {
      "@type": "Answer",
      text: a,
    },
  })),
};

export default async function HomePage() {
  const seed = getRotatingSeed();

  const sixComponents = pickSix(allComponents, seed, null);
  /*
   * The blocks strip shows the studio sets and nothing else: six blocks pulled at
   * random from the whole catalogue read as six unrelated screenshots, while six
   * from the sets read as a design language someone thought about. The
   * membership list is generated from the sets' own demo copy — see
   * scripts/generate-block-sets.ts, and rerun it when a set grows.
   */
  const blockPool = blocks.filter(
    (b) => b.category !== "Coming Soon" && STUDIO_SET_BLOCKS.has(b.name)
  );
  const sixBlocks = pickSix(blockPool, seed, null);
  const sixRegistryComponents = seededShuffle(registryComponents, seed).slice(0, 6);

  /*
   * The newest release, formatted here rather than in the hero: the hero is a
   * client component, and a date formatted there would render one way on the
   * server and another in the browser.
   */
  const newest = changelog[0];
  const latestRelease = newest
    ? {
        title: newest.title,
        date: new Date(`${newest.date}T00:00:00`).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      }
    : undefined;

  return (
    <div>
      {/*
        The hero sits outside the page's column on purpose: it is an image that has
        to reach both edges, and the negative top margin cancels the layout's own
        padding so it starts flush under the bar rather than floating below it.

        It is hero130's shape with the announcement ticker replaced by the search —
        our own copy of the block (see `home-hero-search`), since a search field is
        not something the catalogue's studio hero should grow.
      */}
      <HomeHeroSearch
        // The last child is the content column; the two before it are the image and
        // its overlay, and capping those would stop the picture short of the edges.
        className="-mt-12 md:-mt-16 [&>div:last-child]:max-w-6xl md:py-16"
        // Not a description of the product: the counts sit two rows below and the
        // page title carries the search terms, so the hero is free to be a poster.
        heading="Already built."
        subheading="Every screen a website needs. Yours to take."
        backgroundImage={{
          src: "https://images.unsplash.com/photo-1755126623866-0d612c7dc801?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "",
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <HomeHero
          blocks={blocks.length}
          pieces={allComponents.length}
          components={registryComponents.length}
          release={latestRelease}
        />

        {/* Blocks preview */}
        <section className="mb-16">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
              <span className="font-semibold">Full-page blocks</span>, production-ready
            </h2>
            <Button12
              asChild
              label="Browse all blocks"
              tone="outline"
              // The section is one tap from the top of the grid on a phone, and
              // the first card under it goes to the same place; a full-width seal
              // button there was a second front door taking a screenful.
              className="hidden shrink-0 sm:inline-flex"
            >
              <Link href="/blocks" />
            </Button12>
          </div>

          <BlocksGrid blocks={sixBlocks} addedDates={recentBlockDates()} skeletonCount={6} />
        </section>

        {/* Components preview */}
        <section className="mb-16">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
              <span className="font-semibold">Components</span>, the primitives behind it all
            </h2>
            <Button12
              asChild
              label="Browse all components"
              tone="outline"
              // The section is one tap from the top of the grid on a phone, and
              // the first card under it goes to the same place; a full-width seal
              // button there was a second front door taking a screenful.
              className="hidden shrink-0 sm:inline-flex"
            >
              <Link href="/components" />
            </Button12>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sixRegistryComponents.map((c) => (
              <article
                key={c.name}
                className="group relative flex flex-col gap-3 rounded-xl bg-muted p-3 transition-colors hover:bg-muted-foreground/15 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring"
              >
                {/*
                The preview is a picture of the component, not the component: these
                demos are live, so a slider dragged and a switch flipped here left the
                card looking clicked without ever going anywhere. `inert` takes the
                whole subtree out of the tab order and the accessibility tree, and
                `pointer-events-none` lets the click fall through to the link that
                covers the card.
              */}
                <div
                  inert
                  className="pointer-events-none relative flex aspect-[4/3] select-none items-center justify-center overflow-hidden rounded-md bg-background"
                  style={{
                    backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                >
                  <RegistryComponentDemo name={c.name} />
                </div>
                {/*
                Not positioned. The link below stretches itself with an absolutely
                positioned pseudo-element, and `inset-0` measures from the nearest
                positioned ancestor — with a `relative` here, the clickable area
                stopped at the title and the description instead of covering the
                card. The article is the one that is `relative`, and it should be.
              */}
                <div className="flex flex-col gap-1 px-1 pb-1">
                  <h3 className="text-base font-semibold tracking-tight">
                    <Link
                      href={`/component/${c.name}`}
                      className="outline-none before:absolute before:inset-0 before:rounded-xl before:content-['']"
                    >
                      {c.title}
                    </Link>
                  </h3>
                  <p className="line-clamp-2 text-base text-muted-foreground">{c.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Pieces preview */}
        <section className="mb-16">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
              <span className="font-semibold">Small pieces</span>, ready to drop in
            </h2>
            <Button12
              asChild
              label="Browse all pieces"
              tone="outline"
              // The section is one tap from the top of the grid on a phone, and
              // the first card under it goes to the same place; a full-width seal
              // button there was a second front door taking a screenful.
              className="hidden shrink-0 sm:inline-flex"
            >
              <Link href="/pieces" />
            </Button12>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sixComponents.map((c) => (
              <article
                key={c.name}
                className="group relative flex flex-col gap-3 rounded-xl bg-muted p-3 transition-colors hover:bg-muted-foreground/15 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring"
              >
                {/*
                The preview is a picture of the component, not the component: these
                demos are live, so a slider dragged and a switch flipped here left the
                card looking clicked without ever going anywhere. `inert` takes the
                whole subtree out of the tab order and the accessibility tree, and
                `pointer-events-none` lets the click fall through to the link that
                covers the card.
              */}
                <div
                  inert
                  className="pointer-events-none relative flex aspect-[4/3] select-none items-center justify-center overflow-hidden rounded-md bg-background"
                  style={{
                    backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                >
                  <ComponentDemo name={c.name} />
                </div>
                {/*
                Not positioned. The link below stretches itself with an absolutely
                positioned pseudo-element, and `inset-0` measures from the nearest
                positioned ancestor — with a `relative` here, the clickable area
                stopped at the title and the description instead of covering the
                card. The article is the one that is `relative`, and it should be.
              */}
                <div className="flex flex-col gap-1 px-1 pb-1">
                  {/* The pseudo-element stretches this one link over the whole card,
                    which is the same shape the listing grids use. */}
                  <h3 className="text-base font-semibold tracking-tight">
                    <Link
                      href={`/piece/${c.name}`}
                      className="outline-none before:absolute before:inset-0 before:rounded-xl before:content-['']"
                    >
                      {c.title}
                    </Link>
                  </h3>
                  <p className="line-clamp-2 text-base text-muted-foreground">{c.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Bottom sections (preserved from previous design) */}
        <div className="border-t pt-12 lg:pt-24">
          {/*
          The block's own heading, not one built beside it. What it has no slot for is
          a line under that heading: `heading`, `badge` and `button` are the only text
          it takes, and the three cards already say what the sentence there used to
          say. The container override is still needed, since the block draws its own
          max-width column and this page is already inside one.
        */}
          <Feature230
            className="pt-0 [&>div]:max-w-none [&>div]:px-0"
            badge={{ label: "How it works" }}
            heading="From browse to <strong>build in seconds.</strong>"
            button={{ label: "Start browsing", href: "/blocks" }}
            items={[
              {
                title: "Browse",
                description: `Explore ${blocks.length}+ blocks and ${allComponents.length}+ pieces across dozens of categories.`,
                // The block's own photographs, kept as they are. Empty alt on purpose:
                // beside "Browse" a description of an interior is a sentence a screen
                // reader has to sit through for no reason.
                image: {
                  src: "https://images.unsplash.com/photo-1562146398-1b732c203bc4?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  alt: "",
                },
              },
              {
                title: "Copy",
                description:
                  "Click to copy the install command. Each piece is self-contained with all required styles and logic.",
                image: {
                  src: "https://images.unsplash.com/photo-1536185752-9dc80dd63510?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  alt: "",
                },
              },
              {
                title: "Customize",
                description:
                  "Tailwind CSS makes it easy to adjust colors, spacing, and typography to match your brand.",
                image: {
                  src: "https://images.unsplash.com/photo-1516247524857-8dc5f4786cb3?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  alt: "",
                },
              },
            ]}
          />

          {/*
          The questions are the same ones, and the structured data is still emitted
          from the same array, so the block only changes how they are presented — a
          crawler reads exactly what it read before.
        */}
          <section className="mb-12 lg:mb-16">
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <Faq77
              badge={{ label: "Questions" }}
              heading="Everything about installing, licensing and owning the code."
              labels={{
                note: "Still stuck on something specific? Open an issue on GitHub or ask on X. We read all of it.",
              }}
              button={{
                label: "Ask on X",
                href: "https://twitter.com/withbeste",
              }}
              items={FAQS.map((item, index) => ({
                index: String(index + 1).padStart(2, "0"),
                question: item.q,
                answer: item.a,
              }))}
            />
          </section>
        </div>
      </div>

      {/*
        The closing CTA is one of the library's own blocks, cta69, filled with the
        real inventory. It sits after the page's column rather than inside it: the
        marquee running behind it is the width of the page, and in a `max-w-6xl`
        box it was a wide idea in a narrow one. A negative margin would only have
        cancelled the padding, not the cap, so the block simply lives outside.
      */}
      <Cta69
        badge={{ label: "Start here" }}
        heading="Everything you need is already built."
        button={{ label: "Browse the library", href: "/blocks" }}
        labels={{
          marqueePhrase: "Ship it",
          note: `${blocks.length} blocks, ${allComponents.length} pieces and ${registryComponents.length} components for shadcn/ui and Tailwind. Install one with a command and the code is yours.`,
          footnote: "Updated weekly. MIT for free, commercial licence for Pro.",
        }}
      />
    </div>
  );
}
