"use client";

import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ListItem {
  id: string;
  text: string;
}

interface ButtonItem {
  id: string;
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
}

interface UseCase10Props {
  badge?: {
    label: string;
    icon?: React.ReactNode;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  listItems?: ListItem[];
  buttons?: ButtonItem[];
  image?: {
    src: string;
    alt: string;
  };
  imagePosition?: "left" | "right";
  className?: string;
}

export const usecase10Demo: UseCase10Props = {
  badge: {
    label: "Private Events",
    icon: <Calendar className="size-3.5" />,
    variant: "outline",
  },
  heading: "Celebrate With Us",
  description:
    'From intimate birthday dinners to corporate gatherings, our private dining room "The Cellar" offers seclusion and sophistication for groups up to 40.',
  listItems: [
    { id: "item-1", text: "Custom Menus" },
    { id: "item-2", text: "Dedicated Sommelier" },
    { id: "item-3", text: "AV Equipment Available" },
  ],
  buttons: [
    { id: "btn-1", label: "Inquire for Events", href: "https://beste.co" },
  ],
  image: {
    src: "https://images.unsplash.com/photo-1551845728-6820a30c64e2?w=900&auto=format&fit=crop&q=60",
    alt: "Private Dining",
  },
  imagePosition: "right",
};

export function UseCase10({
  badge,
  heading,
  description,
  listItems,
  buttons,
  image,
  imagePosition = "right",
  className,
}: UseCase10Props) {
  const isImageRight = imagePosition === "right";

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="rounded-lg overflow-hidden shadow-lg bg-card">
          <div
            className={cn(
              "flex flex-col md:flex-row",
              !isImageRight && "md:flex-row-reverse"
            )}
          >
            {/* Content Column */}
            <div className="md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
              {/* Badge */}
              {badge?.label && (
                <div className="mb-4">
                  <Badge
                    variant={badge.variant ?? "default"}
                    className="gap-1.5"
                  >
                    {badge.icon}
                    {badge.label}
                  </Badge>
                </div>
              )}

              {/* Heading */}
              {heading && (
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-card-foreground">
                  {heading}
                </h2>
              )}

              {/* Description */}
              {description && (
                <p className="mb-6 text-muted-foreground">{description}</p>
              )}

              {/* List Items */}
              {listItems && listItems.length > 0 && (
                <ul className="space-y-1.5 mb-8">
                  {listItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 text-card-foreground"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Buttons */}
              {buttons && buttons.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {buttons.map((button, index) => (
                    <Button
                      key={button.id}
                      variant={
                        button.variant ?? (index === 0 ? "default" : "outline")
                      }
                      asChild
                    >
                      <Link href={button.href ?? "#"}>{button.label}</Link>
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Image Column */}
            <div className="md:w-1/2 bg-muted">
              {image && (
                <div className="relative w-full h-full min-h-[300px] md:min-h-[400px]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
