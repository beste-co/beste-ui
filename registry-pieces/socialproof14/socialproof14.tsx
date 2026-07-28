"use client";

import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface Socialproof14Props {
  src?: string;
  alt?: string;
  name?: string;
  role?: string;
  className?: string;
}

export const socialproof14Demo: Socialproof14Props = {
  src: "https://images.unsplash.com/photo-1586190900075-ed480859b2a1?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D",
  alt: "John Doe portrait",
  name: "John Doe",
  role: "PM at Northwind",
};

export function Socialproof14({ src, alt, name, role, className }: Socialproof14Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="flex w-40 flex-col gap-2">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-muted shadow-sm">
          {src && <img src={src} alt={alt ?? ""} className="absolute inset-0 size-full object-cover" />}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-md">
              <Play className="size-4 translate-x-px fill-current" aria-hidden="true" />
            </span>
          </div>
        </div>
        {(name || role) && (
          <div className="flex flex-col">
            {name && <span className="text-sm font-semibold text-card-foreground">{name}</span>}
            {role && <span className="text-xs text-muted-foreground">{role}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
