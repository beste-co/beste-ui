"use client";

import Link from "next/link";
import { Badge7 } from "@/components/beste/component/badge7";
import { Button12 } from "@/components/beste/component/button12";
import { cn } from "@/lib/utils";

interface Badge {
  label: string;
}

interface ActionButton {
  label: string;
  href: string;
}

interface PostImage {
  src: string;
  alt: string;
}

interface FeaturedPost {
  image: PostImage;
  category: string;
  title: string;
  excerpt: string;
  meta: string;
  href: string;
}

interface PostLink {
  category: string;
  title: string;
  meta: string;
  href: string;
}

interface Blog57Labels {
  listTitle?: string;
}

interface Blog57Props {
  badge?: Badge;
  heading?: string;
  featured?: FeaturedPost;
  posts?: PostLink[];
  button?: ActionButton;
  labels?: Blog57Labels;
  className?: string;
}

export const blog57Demo: Blog57Props = {
  badge: { label: "The journal" },
  heading: "What we work out in writing.",
  featured: {
    image: {
      src: "https://images.unsplash.com/photo-1773244175899-76ce69d3e2aa?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Spread of a printed editorial type specimen",
    },
    category: "Process",
    title: "The brief we now refuse to start without",
    excerpt:
      "Every project that went sideways skipped the same page. Here is the single sheet we ask for before anyone opens a design file, and the three questions on it that do the real work.",
    meta: "12 April 2026 · 8 min read",
    href: "https://beste.co",
  },
  posts: [
    {
      category: "Typography",
      title: "Setting a type scale that survives real copy",
      meta: "28 March 2026 · 6 min read",
      href: "https://beste.co",
    },
    {
      category: "Studio",
      title: "Why we still print everything before it ships",
      meta: "9 March 2026 · 4 min read",
      href: "https://beste.co",
    },
    {
      category: "Craft",
      title: "Naming things the client has already named",
      meta: "21 February 2026 · 5 min read",
      href: "https://beste.co",
    },
  ],
  button: {
    label: "Read every entry",
    href: "https://beste.co",
  },
  labels: {
    listTitle: "Also this season",
  },
};

export function Blog57({
  badge,
  heading,
  featured,
  posts = [],
  button,
  labels = {},
  className,
}: Blog57Props) {
  const { listTitle } = labels;

  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            {badge && <Badge7 label={badge.label} />}
            {heading && (
              <h2 className="mt-6 max-w-2xl text-balance text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
                {heading}
              </h2>
            )}
          </div>

          {button && (
            <Button12 asChild label={button.label} tone="outline">
              <Link href={button.href} />
            </Button12>
          )}
        </div>

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-[1.35fr_1fr] md:gap-16">
          {featured && (
            <Link href={featured.href} className="block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-muted">
                <img
                  className="absolute inset-0 size-full object-cover"
                  src={featured.image.src}
                  alt={featured.image.alt}
                />
              </div>

              <p className="mt-6 text-base text-muted-foreground md:text-lg">{featured.category}</p>
              <h3 className="mt-3 text-balance text-2xl font-bold leading-tight tracking-tight text-foreground md:text-3xl lg:text-4xl">
                {featured.title}
              </h3>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                {featured.excerpt}
              </p>
              <p className="mt-5 text-base text-muted-foreground md:text-lg">{featured.meta}</p>
            </Link>
          )}

          {posts.length > 0 && (
            <div className="md:pt-2">
              {listTitle && <Badge7 label={listTitle} />}

              <div className="mt-6 flex flex-col gap-8">
                {posts.map((post, index) => (
                  <Link key={index} href={post.href} className="block border-t pt-6">
                    <p className="text-base text-muted-foreground md:text-lg">{post.category}</p>
                    <h3 className="mt-2 text-balance text-xl font-bold leading-snug tracking-tight text-foreground md:text-2xl">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-base text-muted-foreground md:text-lg">{post.meta}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
