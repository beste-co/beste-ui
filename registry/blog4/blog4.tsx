"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

interface Blog4Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  posts?: BlogPost[];
  labels?: {
    readMoreLabel?: string;
  };
  className?: string;
}

export const blog4Demo: Blog4Props = {
  badge: { label: "Blog", variant: "default" },
  heading: "Featured Stories",
  description: "Hand-picked articles from our editorial team.",
  labels: {
    readMoreLabel: "Read more",
  },
  posts: [
    {
      image: {
        src: "https://images.unsplash.com/photo-1761839259112-aaea03db3633?w=800&fit=crop",
        alt: "Featured article",
      },
      title: "The Future of Design Systems in Modern Web Development",
      summary:
        "Exploring how design systems are evolving to meet the demands of increasingly complex web applications. Learn about the latest trends and best practices.",
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
        { label: "Featured", href: "/block/post22" },
        { label: "Design Systems", href: "/block/post22" },
      ],
      href: "/block/post22",
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
      tags: [{ label: "API", href: "/block/post5" }],
      href: "/block/post5",
    },
    {
      image: {
        src: "https://images.unsplash.com/photo-1761839258575-038fef381ee7?w=800&fit=crop",
        alt: "React performance",
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
      tags: [{ label: "React", href: "/block/post9" }],
      href: "/block/post9",
    },
    {
      image: {
        src: "https://images.unsplash.com/photo-1761839257946-4616bcfafec7?w=800&fit=crop",
        alt: "TypeScript patterns",
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
      tags: [{ label: "TypeScript", href: "/block/post13" }],
      href: "/block/post13",
    },
  ],
};

export function Blog4({ badge, heading, description, posts = [], labels, className }: Blog4Props) {
  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);

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

        {featuredPost && (
          <article className="group/blog4-featured mb-8 overflow-hidden rounded-md border bg-card">
            <div className="grid gap-0 md:grid-cols-2">
              <Link
                href={featuredPost.href ?? "#"}
                className="relative aspect-video overflow-hidden md:aspect-auto"
              >
                <img
                  className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover/blog4-featured:scale-105"
                  src={featuredPost.image.src}
                  alt={featuredPost.image.alt}
                />
              </Link>

              <div className="flex flex-col justify-center p-6 md:p-8">
                {featuredPost.tags && featuredPost.tags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {featuredPost.tags.map((tag, tagIndex) => (
                      <Link key={tagIndex} href={tag.href ?? "#"}>
                        <Badge variant="outline">{tag.label}</Badge>
                      </Link>
                    ))}
                  </div>
                )}

                <Link href={featuredPost.href ?? "#"}>
                  <h3 className="mb-3 text-xl font-semibold transition-colors group-hover/blog4-featured:text-primary md:text-2xl">
                    {featuredPost.title}
                  </h3>
                </Link>

                <p className="mb-6 text-muted-foreground">{featuredPost.summary}</p>

                <div className="flex items-center justify-between">
                  {featuredPost.author && (
                    <div className="flex items-center gap-3">
                      {featuredPost.author.avatar && (
                        <Avatar className="size-10">
                          <AvatarImage
                            src={featuredPost.author.avatar.src}
                            alt={featuredPost.author.avatar.alt}
                            className="object-cover"
                          />
                          <AvatarFallback>
                            {featuredPost.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <p className="text-sm font-medium">{featuredPost.author.name}</p>
                        {(featuredPost.date || featuredPost.readTime) && (
                          <p className="text-xs text-muted-foreground">
                            {featuredPost.date}
                            {featuredPost.date && featuredPost.readTime && " · "}
                            {featuredPost.readTime}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <Button variant="ghost" size="sm" asChild>
                    <Link href={featuredPost.href ?? "#"}>
                      {labels?.readMoreLabel ?? "Read more"}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </article>
        )}

        {gridPosts.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gridPosts.map((post, index) => (
              <article
                key={index}
                className="group/blog4 flex flex-col overflow-hidden rounded-md border bg-card"
              >
                <Link href={post.href ?? "#"} className="relative aspect-video overflow-hidden">
                  <img
                    className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover/blog4:scale-105"
                    src={post.image.src}
                    alt={post.image.alt}
                  />
                </Link>

                <div className="flex flex-1 flex-col p-5">
                  {post.tags && post.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag, tagIndex) => (
                        <Link key={tagIndex} href={tag.href ?? "#"}>
                          <Badge variant="outline" className="text-xs">
                            {tag.label}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  )}

                  <Link href={post.href ?? "#"}>
                    <h3 className="mb-2 line-clamp-2 text-lg font-semibold transition-colors group-hover/blog4:text-primary">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground">
                    {post.summary}
                  </p>

                  <div className="mt-auto flex items-center gap-2">
                    {post.author?.avatar && (
                      <Avatar className="size-6">
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
                    {post.author && <span className="text-sm font-medium">{post.author.name}</span>}
                    {post.readTime && (
                      <>
                        <span className="text-muted-foreground">&middot;</span>
                        <span className="text-sm text-muted-foreground">{post.readTime}</span>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
