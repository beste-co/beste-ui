"use client";

import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Author {
  name: string;
  title?: string;
  avatar?: {
    src: string;
    alt: string;
  };
  href?: string;
}

interface Tag {
  label: string;
  href?: string;
}

interface BlogPost {
  image: {
    src: string;
    alt: string;
  };
  title: string;
  summary: string;
  date?: string;
  readTime?: string;
  author?: Author;
  tags?: Tag[];
  href?: string;
}

interface Blog25Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  featuredImage?: {
    src: string;
    alt: string;
  };
  posts?: BlogPost[];
  className?: string;
}

export const blog25Demo: Blog25Props = {
  badge: { label: "Featured", variant: "default" },
  heading: "Editor's Choice",
  description: "Handpicked articles by our editorial team.",
  featuredImage: {
    src: "https://images.unsplash.com/photo-1761839259112-aaea03db3633?w=800&fit=crop",
    alt: "Featured articles",
  },
  posts: [
    {
      image: {
        src: "https://images.unsplash.com/photo-1761839259112-aaea03db3633?w=800&fit=crop",
        alt: "Design systems",
      },
      title: "The Future of Design Systems",
      summary: "How design systems are evolving.",
      date: "January 15, 2026",
      readTime: "8 min",
      author: {
        name: "Lisa Park",
        title: "Senior Developer",
        avatar: {
          src: "https://images.unsplash.com/photo-1595429935434-f2d6f6004424?w=100&fit=crop",
          alt: "Lisa Park",
        },
      },
      tags: [{ label: "Design", href: "/block/post12" }],
      href: "/block/post12",
    },
    {
      image: {
        src: "https://images.unsplash.com/photo-1761839258671-6495fdc188b3?w=800&fit=crop",
        alt: "API design",
      },
      title: "Building Scalable APIs",
      summary: "Best practices for API design.",
      date: "January 12, 2026",
      readTime: "12 min",
      author: {
        name: "David Chen",
        title: "Backend Engineer",
        avatar: {
          src: "https://images.unsplash.com/photo-1613508862761-40728c924737?w=100&fit=crop",
          alt: "David Chen",
        },
      },
      tags: [{ label: "Backend", href: "/block/post5" }],
      href: "/block/post5",
    },
    {
      image: {
        src: "https://images.unsplash.com/photo-1761839258575-038fef381ee7?w=800&fit=crop",
        alt: "React",
      },
      title: "React Performance Optimization",
      summary: "Strategies for faster apps.",
      date: "January 10, 2026",
      readTime: "10 min",
      author: {
        name: "Alex Turner",
        title: "Frontend Lead",
        avatar: {
          src: "https://images.unsplash.com/photo-1677531427892-239e0797cf60?w=100&fit=crop",
          alt: "Alex Turner",
        },
      },
      tags: [{ label: "React", href: "/block/post9" }],
      href: "/block/post9",
    },
    {
      image: {
        src: "https://images.unsplash.com/photo-1761839257946-4616bcfafec7?w=800&fit=crop",
        alt: "TypeScript",
      },
      title: "Advanced TypeScript Patterns",
      summary: "Make your codebase maintainable.",
      date: "January 8, 2026",
      readTime: "15 min",
      author: {
        name: "Maria Santos",
        title: "Tech Lead",
        avatar: {
          src: "https://images.unsplash.com/photo-1731394726166-2817371bf003?w=100&fit=crop",
          alt: "Maria Santos",
        },
      },
      tags: [{ label: "TypeScript", href: "/block/post13" }],
      href: "/block/post13",
    },
  ],
};

export function Blog25({
  badge,
  heading,
  description,
  featuredImage,
  posts = [],
  className,
}: Blog25Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col">
            {(badge || heading || description) && (
              <div className="mb-8">
                {badge && (
                  <div className="mb-4">
                    <Badge variant={badge.variant ?? "default"}>{badge.label}</Badge>
                  </div>
                )}
                {heading && <h2 className="text-2xl font-semibold md:text-4xl">{heading}</h2>}
                {description && <p className="mt-4 text-muted-foreground">{description}</p>}
              </div>
            )}

            {featuredImage && (
              <div className="relative aspect-video overflow-hidden rounded-md lg:flex-1 lg:aspect-auto">
                <img
                  className="absolute inset-0 size-full object-cover"
                  src={featuredImage.src}
                  alt={featuredImage.alt}
                />
              </div>
            )}
          </div>

          <div className="space-y-0 divide-y">
            {posts.map((post, index) => (
              <article key={index} className="group/blog25 py-4 first:pt-0 last:pb-0">
                <Link href={post.href ?? "#"} className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {post.tags?.[0] && (
                      <span className="mb-1 block text-xs font-medium text-primary">
                        {post.tags[0].label}
                      </span>
                    )}
                    <h3 className="mb-1 font-semibold transition-colors group-hover/blog25:text-primary">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{post.summary}</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {post.date}
                      {post.readTime && ` · ${post.readTime}`}
                    </div>
                  </div>
                  <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover/blog25:translate-x-1 group-hover/blog25:text-primary" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
