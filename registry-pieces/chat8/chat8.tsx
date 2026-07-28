"use client";

import { MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Chat8Props {
  src?: string;
  alt?: string;
  fallback?: string;
  name?: string;
  handle?: string;
  bio?: string;
  className?: string;
}

export const chat8Demo: Chat8Props = {
  src: "https://images.unsplash.com/photo-1672794776762-18dddc72982e?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQzfHxwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
  alt: "Sarah Brown",
  fallback: "SB",
  name: "Sarah Brown",
  handle: "@sarah.b",
  bio: "Frontend at Kindred · Istanbul",
};

export function Chat8({ src, alt, fallback = "??", name, handle, bio, className }: Chat8Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="flex w-full max-w-64 flex-col items-center gap-2 rounded-2xl bg-muted p-4 text-center shadow-sm">
        <Avatar className="size-14">
          <AvatarImage src={src} alt={alt} className="object-cover" />
          <AvatarFallback className="text-base font-semibold">{fallback}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5">
          {name && <span className="text-sm font-semibold text-card-foreground">{name}</span>}
          {handle && <span className="text-xs text-muted-foreground">{handle}</span>}
        </div>
        {bio && <span className="text-xs leading-snug text-muted-foreground">{bio}</span>}
        <button
          type="button"
          className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <MessageCircle className="size-3" aria-hidden="true" />
          Message
        </button>
      </div>
    </div>
  );
}
