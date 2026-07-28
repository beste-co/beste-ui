import { BlogPre } from "./code-block";
import { Callout } from "./callout";
import type { ComponentProps } from "react";
import { FreeCta } from "./free-cta";
import Link from "next/link";
import { LiveBlock } from "./live-block";
import { ProCta } from "./pro-cta";
import { ThemePlayground } from "./theme-playground";
import { Tweet } from "./tweet";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

/**
 * Element + custom-component map for MDX posts. No typography plugin — every
 * element is styled explicitly with the project's design tokens so posts read
 * like the rest of the site.
 */
const components = {
  h1: (props: ComponentProps<"h1">) => (
    <h2
      className="mt-14 scroll-mt-24 text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground"
      {...props}
    />
  ),
  h2: (props: ComponentProps<"h2">) => (
    <h3
      className="mt-14 scroll-mt-24 text-2xl font-semibold leading-tight tracking-tight text-foreground"
      {...props}
    />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h4
      className="mt-10 scroll-mt-24 text-xl font-semibold tracking-tight text-foreground"
      {...props}
    />
  ),
  h4: (props: ComponentProps<"h4">) => (
    <h5
      className="mt-8 scroll-mt-24 text-lg font-semibold tracking-tight text-foreground"
      {...props}
    />
  ),
  p: (props: ComponentProps<"p">) => <p className="mt-6 text-lg leading-8 text-foreground/85" {...props} />,
  a: ({ href = "", ...props }: ComponentProps<"a">) => {
    const isExternal = /^https?:/.test(href);
    const cls =
      "font-medium text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground";
    if (isExternal) {
      return <a href={href} target="_blank" rel="noreferrer" className={cls} {...props} />;
    }
    return <Link href={href} className={cls} {...props} />;
  },
  ul: (props: ComponentProps<"ul">) => (
    <ul
      className="mt-6 list-disc space-y-2.5 pl-5 text-lg text-foreground/85 marker:text-foreground/40"
      {...props}
    />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol
      className="mt-6 list-decimal space-y-2.5 pl-5 text-lg text-foreground/85 marker:text-foreground/40"
      {...props}
    />
  ),
  li: (props: ComponentProps<"li">) => <li className="pl-1.5 leading-8" {...props} />,
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      className="mt-8 rounded-xl bg-muted/60 p-6 text-lg italic text-foreground/80 [&>:first-child]:mt-0 [&>:last-child]:mb-0"
      {...props}
    />
  ),
  hr: () => <hr className="my-14 border-border" />,
  strong: (props: ComponentProps<"strong">) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  code: (props: ComponentProps<"code">) => (
    <code
      className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"
      {...props}
    />
  ),
  pre: BlogPre,
  table: (props: ComponentProps<"table">) => (
    <div className="my-8 overflow-x-auto rounded-xl bg-muted/60">
      <table className="w-full border-collapse text-base" {...props} />
    </div>
  ),
  thead: (props: ComponentProps<"thead">) => <thead className="bg-foreground/5" {...props} />,
  th: (props: ComponentProps<"th">) => (
    <th className="border-b border-foreground/10 px-4 py-3 text-left font-semibold text-foreground" {...props} />
  ),
  td: (props: ComponentProps<"td">) => (
    <td className="border-b border-foreground/10 px-4 py-3 align-top text-foreground/85 last:border-0" {...props} />
  ),
  // biome-ignore lint/a11y/useAltText: alt is passed through from MDX source.
  img: (props: ComponentProps<"img">) => (
    <img className="my-8 w-full rounded-xl" alt="" {...props} />
  ),
  Callout,
  FreeCta,
  LiveBlock,
  ProCta,
  ThemePlayground,
  Tweet,
};

/** What `<ProCta />` compiles to for a reader who already has a license. */
const NoProCta = () => null;

interface MdxProps {
  source: string;
  /**
   * Drops the upgrade CTA for a reader who already has a license. Every block
   * README carries `<ProCta />`, and a paid customer being sold the thing they
   * bought is the one reader it cannot be useful to.
   */
  isUserPro?: boolean;
}

/** Compiles and renders an MDX post body. */
export async function Mdx({ source, isUserPro = false }: MdxProps) {
  const { content } = await compileMDX({
    source,
    components: isUserPro ? { ...components, ProCta: NoProCta } : components,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    },
  });
  return content;
}
