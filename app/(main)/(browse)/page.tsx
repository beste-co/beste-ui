import type { Metadata } from "next";
import { HomeHero } from "@/components/home-hero";
import { HomeLibrary } from "@/components/home-library";
import { HomeCta, HomeFaq } from "@/components/home-sections";
import { blocksObfuscated as blocks } from "@/lib/blocks-obfuscated";
import { components as allComponents } from "@/lib/components";
import { registryComponents } from "@/lib/registry-components";
import { formatCount } from "@/lib/seo-copy";

const SITE_TITLE = "Beste UI: Shadcn Blocks, Components and Page Templates for React";
const SITE_DESCRIPTION = `${formatCount(blocks.length)} shadcn/ui blocks, ${formatCount(registryComponents.length)} free components and full page templates for React, Next.js and Tailwind CSS. Install any of them with the shadcn CLI or the Beste UI MCP server.`;
const CANONICAL = "https://beste.dev/";
// The home page shares the fixed brand image, not a generated one.
const OG_IMAGE = "https://beste.dev/assets/images/beste-ui.png";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    url: CANONICAL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 2560, height: 1440 }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

/*
 * The library bento, picked by hand and shown in this order: the newest blocks
 * take turns in the wide tile that opens it, blocks fill the large square and
 * wide strips, pieces and components the small tiles.
 */
const LIBRARY_FEATURED = ["hero314", "hero317", "hero316", "hero326", "hero331"];
const LIBRARY_BLOCKS = {
  large: ["pricing92"],
  wide: ["cta121", "feature376"],
};
// Where a wide strip looks into a block, 0 its top and 1 its bottom; the default is the middle
const LIBRARY_BLOCK_FOCUS: Record<string, number> = {};
const LIBRARY_PIECES = [
  "isometric240",
  "notification31",
  "progress21",
  "ai62",
  "search30",
  "ai53",
  "monitoring27",
];
const LIBRARY_COMPONENTS = ["anamorphic-type", "split-flap", "glass-lens"];

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
    a: "Yes. Every account gets a referral link and earns 30% commission on every payment from someone you refer, for 12 months after they sign up. You can copy your link and track your referrals and earnings on the Referrals page.",
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
  const toBlocks = (names: string[]) =>
    names
      .map((name) => blocks.find((b) => b.name === name))
      .filter((b) => b !== undefined)
      .map((b) => ({ name: b.name, title: b.title, focus: LIBRARY_BLOCK_FOCUS[b.name] }));
  const libraryBlocks = {
    large: toBlocks(LIBRARY_BLOCKS.large),
    wide: toBlocks(LIBRARY_BLOCKS.wide),
  };

  const libraryPieces = LIBRARY_PIECES.map((name) => allComponents.find((piece) => piece.name === name))
    .filter((piece) => piece !== undefined)
    .map((piece) => ({ name: piece.name, title: piece.title }));

  const libraryComponents = LIBRARY_COMPONENTS.map((name) => registryComponents.find((c) => c.name === name))
    .filter((c) => c !== undefined)
    .map((c) => ({ name: c.name, title: c.title }));

  return (
    <div>
      {/* Pulled up over the layout's top padding so it starts flush under the bar. */}
      <HomeHero
        className="-mt-12 md:-mt-16"
        blocks={blocks.length}
        pieces={allComponents.length}
        components={registryComponents.length}
      />

      <div className="mx-auto w-full max-w-6xl px-4 pt-16 md:px-6 md:pt-24">
        <HomeLibrary
          className="mb-20 md:mb-28"
          featured={toBlocks(LIBRARY_FEATURED)}
          blocks={libraryBlocks}
          pieces={libraryPieces}
          components={libraryComponents}
          counts={{
            blocks: blocks.length,
            pieces: allComponents.length,
            components: registryComponents.length,
          }}
        />

        <div className="border-t pt-12 lg:pt-16">
          {/* The structured data is emitted from the same FAQS array the section renders. */}
          <section className="mb-8 lg:mb-12">
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <HomeFaq
              heading="Everything about installing, licensing and owning the code."
              note="Still stuck on something specific? Open an issue on GitHub or ask on X. We read all of it."
              button={{ label: "Ask on X", href: "https://twitter.com/withbeste" }}
              items={FAQS.map((item) => ({ question: item.q, answer: item.a }))}
            />
          </section>
        </div>
      </div>

      {/* Outside the column: the marquee behind it runs the full width of the page. */}
      <HomeCta
        heading="Everything you need is already built."
        button={{ label: "Browse the library", href: "/blocks" }}
        marquee="Ship it"
        note={`${blocks.length} blocks, ${allComponents.length} pieces and ${registryComponents.length} components for shadcn/ui and Tailwind. Install one with a command and the code is yours.`}
        footnote="Updated weekly. MIT for free, commercial licence for Pro."
      />
    </div>
  );
}
