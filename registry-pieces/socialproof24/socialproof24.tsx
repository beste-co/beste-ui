"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Member {
  src: string;
  alt: string;
  name?: string;
}

interface Socialproof24Props {
  items?: Member[];
  className?: string;
}

export const socialproof24Demo: Socialproof24Props = {
  items: [
    {
      src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop",
      alt: "Portrait of a product designer",
    },
    {
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop",
      alt: "Portrait of a frontend engineer",
    },
    {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop",
      alt: "Portrait of a content strategist",
      name: "Dana Whitlock",
    },
    {
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop",
      alt: "Portrait of a product manager",
    },
  ],
};

export function Socialproof24({ items = [], className }: Socialproof24Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-center -space-x-4">
        {items.map((member, index) => (
          <div key={index} className="relative">
            {member.name && (
              <div className="absolute -top-9 left-1/2 z-10 -translate-x-1/2">
                <div className="whitespace-nowrap rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-card-foreground shadow-md">
                  {member.name}
                </div>
                <span
                  className="absolute left-1/2 top-full size-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-border bg-card"
                  aria-hidden="true"
                />
              </div>
            )}
            <Avatar className="size-14 border-2 border-background shadow-sm">
              <AvatarImage
                src={member.src}
                alt={member.alt}
                className="object-cover"
              />
              <AvatarFallback>
                {member.alt
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
        ))}
      </div>
    </div>
  );
}
