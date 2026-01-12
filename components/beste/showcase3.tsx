"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GalleryItem {
  src: string;
  alt: string;
  caption?: string;
  href?: string;
}

interface Showcase3Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  images?: GalleryItem[];
  className?: string;
}

export const showcase3Demo: Showcase3Props = {
  badge: { label: "Gallery", variant: "secondary" },
  heading: "See our work in action",
  description:
    "Browse through our collection of successful projects and implementations",
  images: [
    {
      src: "https://images.unsplash.com/photo-1565768502719-571073a68b4c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dmFsZW5jaWF8ZW58MHx8MHx8fDA%3D",
      alt: "Project 1",
      caption: "Enterprise Dashboard",
      href: "https://beste.co",
    },
    {
      src: "https://images.unsplash.com/photo-1583265101492-bfe6ef35cef8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHZhbGVuY2lhfGVufDB8fDB8fHww",
      alt: "Project 2",
      caption: "Mobile Application",
      href: "https://beste.co",
    },
    {
      src: "https://images.unsplash.com/photo-1598618788227-8ddd0271e1d1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHZhbGVuY2lhfGVufDB8fDB8fHww",
      alt: "Project 3",
      caption: "E-commerce Platform",
      href: "https://beste.co",
    },
    {
      src: "https://images.unsplash.com/photo-1679510339995-295e406a0068?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHZhbGVuY2lhfGVufDB8fDB8fHww",
      alt: "Project 4",
      caption: "SaaS Analytics",
      href: "https://beste.co",
    },
    {
      src: "https://images.unsplash.com/photo-1604781852341-00446b474291?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fHZhbGVuY2lhfGVufDB8fDB8fHww",
      alt: "Project 5",
      caption: "Healthcare Portal",
      href: "https://beste.co",
    },
    {
      src: "https://images.unsplash.com/photo-1516028809107-225c7e6bf3ec?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fHZhbGVuY2lhfGVufDB8fDB8fHww",
      alt: "Project 6",
      caption: "Financial Dashboard",
      href: "https://beste.co",
    },
  ],
};

export function Showcase3({
  badge,
  heading,
  description,
  images = [],
  className,
}: Showcase3Props) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mb-12 text-center">
            {badge && (
              <Badge variant={badge.variant ?? "default"} className="mb-4">
                {badge.label}
              </Badge>
            )}
            {heading && (
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-lg text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        {images.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => {
              const content = (
                <>
                  <div className="aspect-[3/2] overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={600}
                      height={400}
                      className="size-full object-cover transition-transform duration-300 group-hover/showcase3:scale-105"
                    />
                  </div>
                  {image.caption && (
                    <div className="p-4">
                      <p className="font-medium">{image.caption}</p>
                    </div>
                  )}
                </>
              );

              const cardClasses =
                "group/showcase3 relative overflow-hidden rounded-xl border bg-card";

              return image.href ? (
                <Link key={index} href={image.href} className={cardClasses}>
                  {content}
                </Link>
              ) : (
                <div key={index} className={cardClasses}>
                  {content}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
