"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

interface Blog3Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  posts?: BlogPost[];
  className?: string;
}

export const blog3Demo: Blog3Props = {
  badge: { label: "Blog", variant: "default" },
  heading: "Latest Articles",
  description: "Discover insights, tutorials, and updates from our team of experts.",
  posts: [
    {
      image: {
        src: "https://images.unsplash.com/photo-1761839259112-aaea03db3633?w=800&fit=crop",
        alt: "Design systems article",
      },
      title: "The Future of Design Systems in Modern Web Development",
      summary:
        "Exploring how design systems are evolving to meet the demands of increasingly complex web applications.",
      date: "January 15, 2026",
      readTime: "8 min read",
      author: {
        name: "Lisa Park",
        title: "Senior Developer",
        avatar: {
          src: "https://images.unsplash.com/photo-1595429935434-f2d6f6004424?w=100&fit=crop",
          alt: "Lisa Park",
        },
      },
      tags: [
        { label: "Design Systems", href: "/block/post3" },
        { label: "Web Development", href: "/block/post3" },
      ],
      href: "/block/post3",
    },
    {
      image: {
        src: "https://images.unsplash.com/photo-1761839258671-6495fdc188b3?w=800&fit=crop",
        alt: "API design article",
      },
      title: "Building Scalable APIs with Modern Architecture",
      summary: "Learn the best practices for designing APIs that can handle millions of requests.",
      date: "January 12, 2026",
      readTime: "12 min read",
      author: {
        name: "David Chen",
        title: "Backend Engineer",
        avatar: {
          src: "https://images.unsplash.com/photo-1613508862761-40728c924737?w=100&fit=crop",
          alt: "David Chen",
        },
      },
      tags: [{ label: "API", href: "/block/post7" }],
      href: "/block/post7",
    },
    {
      image: {
        src: "https://images.unsplash.com/photo-1761839258575-038fef381ee7?w=800&fit=crop",
        alt: "React performance article",
      },
      title: "React Performance Optimization Techniques",
      summary: "Practical strategies to improve the performance of your React applications.",
      date: "January 10, 2026",
      readTime: "10 min read",
      author: {
        name: "Alex Turner",
        title: "Frontend Lead",
        avatar: {
          src: "https://images.unsplash.com/photo-1677531427892-239e0797cf60?w=100&fit=crop",
          alt: "Alex Turner",
        },
      },
      tags: [
        { label: "React", href: "/block/post11" },
        { label: "Performance", href: "/block/post11" },
      ],
      href: "/block/post11",
    },
    {
      image: {
        src: "https://images.unsplash.com/photo-1761839257946-4616bcfafec7?w=800&fit=crop",
        alt: "TypeScript article",
      },
      title: "Advanced TypeScript Patterns for Large Applications",
      summary:
        "Discover advanced TypeScript techniques that will make your codebase more maintainable.",
      date: "January 8, 2026",
      readTime: "15 min read",
      author: {
        name: "Maria Santos",
        title: "Tech Lead",
        avatar: {
          src: "https://images.unsplash.com/photo-1731394726166-2817371bf003?w=100&fit=crop",
          alt: "Maria Santos",
        },
      },
      tags: [{ label: "TypeScript", href: "/block/post15" }],
      href: "/block/post15",
    },
    {
      image: {
        src: "https://images.unsplash.com/photo-1576579639321-29a1cd83c64b?w=800&fit=crop",
        alt: "CSS article",
      },
      title: "Modern CSS Techniques You Should Know",
      summary: "A comprehensive guide to the latest CSS features and how to use them effectively.",
      date: "January 5, 2026",
      readTime: "7 min read",
      author: {
        name: "Lisa Park",
        title: "Senior Developer",
        avatar: {
          src: "https://images.unsplash.com/photo-1595429935434-f2d6f6004424?w=100&fit=crop",
          alt: "Lisa Park",
        },
      },
      tags: [{ label: "CSS", href: "/block/post19" }],
      href: "/block/post19",
    },
    {
      image: {
        src: "https://images.unsplash.com/photo-1579088013384-34f5f99cacdb?w=800&fit=crop",
        alt: "Testing article",
      },
      title: "Testing Best Practices for Frontend Applications",
      summary: "Learn how to write effective tests that give you confidence in your code.",
      date: "January 3, 2026",
      readTime: "11 min read",
      author: {
        name: "David Chen",
        title: "Backend Engineer",
        avatar: {
          src: "https://images.unsplash.com/photo-1613508862761-40728c924737?w=100&fit=crop",
          alt: "David Chen",
        },
      },
      tags: [
        { label: "Testing", href: "/block/post23" },
        { label: "Quality", href: "/block/post23" },
      ],
      href: "/block/post23",
    },
  ],
};

export function Blog3({ badge, heading, description, posts = [], className }: Blog3Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {badge && (
              <div className="mb-4 flex justify-center">
                <Badge variant={badge.variant ?? "default"}>{badge.label}</Badge>
              </div>
            )}
            {heading && <h2 className="text-2xl font-semibold md:text-4xl">{heading}</h2>}
            {description && (
              <p className="mt-4 text-base text-muted-foreground md:text-lg">{description}</p>
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <article
              key={index}
              className="group/blog3 flex flex-col overflow-hidden rounded-md border bg-card"
            >
              <Link href={post.href ?? "#"} className="relative aspect-video overflow-hidden">
                <img
                  className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover/blog3:scale-105"
                  src={post.image.src}
                  alt={post.image.alt}
                />
              </Link>

              <div className="flex flex-1 flex-col p-5">
                {post.tags && post.tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {post.tags.map((tag, tagIndex) => (
                      <Link key={tagIndex} href={tag.href ?? "#"}>
                        <Badge variant="outline" className="text-xs">
                          {tag.label}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}

                <Link href={post.href ?? "#"}>
                  <h3 className="mb-2 line-clamp-2 text-lg font-semibold transition-colors group-hover/blog3:text-primary">
                    {post.title}
                  </h3>
                </Link>

                <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground">
                  {post.summary}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  {post.author && (
                    <div className="flex items-center gap-2">
                      {post.author.avatar && (
                        <Avatar className="size-8">
                          <AvatarImage
                            src={post.author.avatar.src}
                            alt={post.author.avatar.alt}
                            className="object-cover"
                          />
                          <AvatarFallback>
                            {post.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <span className="text-sm font-medium">{post.author.name}</span>
                    </div>
                  )}

                  {(post.date || post.readTime) && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {post.date && <span>{post.date}</span>}
                      {post.date && post.readTime && (
                        <span className="block sm:hidden xl:block">&middot;</span>
                      )}
                      {post.readTime && (
                        <span className="block sm:hidden xl:block">{post.readTime}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
