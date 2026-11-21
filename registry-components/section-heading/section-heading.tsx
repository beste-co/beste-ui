"use client";

import { Button27 } from "@/components/beste/component/button27";
import { cn } from "@/lib/utils";

type Layout = "split" | "stack";

export interface SectionHeadingProps {
  heading?: string;
  description?: string;
  /** An underlined text link, under the description or on its own at the end */
  link?: { label: string; href: string };
  /** Several underlined links in a row, after `link` */
  links?: { label: string; href: string }[];
  /** Pills after the copy: the first is ink, the rest outlined */
  buttons?: { label: string; href: string }[];
  /** Heading left and copy right on wide screens, or the copy under the heading */
  layout?: Layout;
  /** The heading level; a page's first heading is h1 */
  as?: "h1" | "h2";
  className?: string;
}

export const sectionHeadingDemo: SectionHeadingProps = {
  heading: "A website, not a codebase",
  description: "AI picks from the same library of designed sections you do, so there is nothing for you or your client to maintain later.",
  layout: "split",
};

export function SectionHeading({ heading, description, link, links = [], buttons = [], layout = "split", as: Heading = "h2", className }: SectionHeadingProps) {
  const all = link ? [link, ...links] : links;
  const anchor = all.length > 0 && (
    <div className="flex flex-wrap gap-x-5.5 gap-y-2">
      {all.map((item, index) => (
        <a key={index} href={item.href} className="w-fit cursor-pointer border-b border-current pb-0.5 text-base text-foreground transition-opacity hover:opacity-70">
          {item.label}
        </a>
      ))}
    </div>
  );
  const pills = buttons.length > 0 && (
    <div className="flex flex-wrap gap-2.5">
      {buttons.map((button, index) => (
        <Button27 key={index} href={button.href} label={button.label} tone={index === 0 ? "primary" : "outline"} />
      ))}
    </div>
  );
  const copy = (description || anchor || pills) && (
    <div className={cn("flex max-w-md flex-col items-start gap-5", layout === "stack" && "max-w-xl")}>
      {description && <p className="text-lg leading-relaxed text-muted-foreground">{description}</p>}
      {anchor}
      {pills}
    </div>
  );

  return (
    <div className={cn("flex", layout === "split" ? "flex-wrap items-end justify-between gap-6" : "flex-col gap-4.5", className)}>
      {heading && <Heading className="max-w-2xl text-4xl leading-none font-medium tracking-tight text-balance md:text-5xl lg:text-6xl">{heading}</Heading>}
      {copy}
    </div>
  );
}
