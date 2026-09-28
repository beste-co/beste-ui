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
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

/**
 * Element map for MDX posts and READMEs, on the site scale in `lib/typography`:
 * `#`/`##` at h2, `###` at h3, body 16px over leading-7.
 */
const components = {
  h1: (props: ComponentProps<"h1">) => (
    <h2
      className={cn(typography.h2, "mt-12 scroll-mt-24 text-balance text-foreground")}
      {...props}
    />
  ),
  h2: (props: ComponentProps<"h2">) => (
    <h3
      className={cn(typography.h2, "mt-12 scroll-mt-24 text-foreground")}
      {...props}
    />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h4
      className={cn(typography.h3, "mt-8 scroll-mt-24 text-foreground")}
      {...props}
    />
  ),
  h4: (props: ComponentProps<"h4">) => (
    <h5
      className="mt-6 scroll-mt-24 text-base font-medium text-foreground"
      {...props}
    />
  ),
  p: (props: ComponentProps<"p">) => <p className="mt-5 text-base leading-7 text-foreground/85" {...props} />,
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
      className="mt-5 list-disc space-y-2 pl-5 text-base text-foreground/85 marker:text-foreground/40"
      {...props}
    />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol
      className="mt-5 list-decimal space-y-2 pl-5 text-base text-foreground/85 marker:text-foreground/40"
      {...props}
    />
  ),
  li: (props: ComponentProps<"li">) => <li className="pl-1.5 leading-7" {...props} />,
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      className="mt-6 rounded-xl bg-muted/60 p-5 text-base italic text-foreground/80 [&>:first-child]:mt-0 [&>:last-child]:mb-0"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-border" />,
  strong: (props: ComponentProps<"strong">) => (
    <strong className="font-medium text-foreground" {...props} />
  ),
  code: (props: ComponentProps<"code">) => (
    <code
      className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"
      {...props}
    />
  ),
  pre: BlogPre,
  table: (props: ComponentProps<"table">) => (
    <div className="my-6 overflow-x-auto rounded-xl bg-muted/60">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: (props: ComponentProps<"thead">) => <thead className="bg-foreground/5" {...props} />,
  th: (props: ComponentProps<"th">) => (
    <th className="border-b border-foreground/10 px-4 py-3 text-left font-medium text-foreground" {...props} />
  ),
  td: (props: ComponentProps<"td">) => (
    <td className="border-b border-foreground/10 px-4 py-3 align-top text-foreground/85 last:border-0" {...props} />
  ),
  // biome-ignore lint/a11y/useAltText: alt is passed through from MDX source.
  img: (props: ComponentProps<"img">) => (
    <img className="my-6 w-full rounded-xl" alt="" {...props} />
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
  /**
   * Docs scale for READMEs: 14px body, headings a step down and code at the site's
   * `CodeBlock` size. Blog posts keep the 16px reading scale.
   */
  compact?: boolean;
}

// Descendant overrides outrank each element's own size class, so one wrapper rescales the whole README
const COMPACT = cn(
  "[&_p]:text-sm [&_p]:leading-6 [&_li]:text-sm [&_li]:leading-6 [&_blockquote]:text-sm",
  "[&_h2]:text-lg [&_h3]:text-base [&_h4]:text-sm",
  "[&_pre]:text-sm/7",
  "[&_:not(pre)>code]:text-[0.8125rem]",
);

/** Compiles and renders an MDX post body. */
export async function Mdx({ source, isUserPro = false, compact = false }: MdxProps) {
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
  return compact ? <div className={COMPACT}>{content}</div> : content;
}
