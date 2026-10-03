"use client";
import { cn } from "@/lib/utils";

interface Media20Props {
  src?: string;
  alt?: string;
  masthead?: string;
  issue?: string;
  bordered?: boolean;
  className?: string;
}

export const media20Demo: Media20Props = {
  src: "https://images.unsplash.com/photo-1504275490777-45f30792f13f?w=300&auto=format&fit=crop&q=60",
  alt: "Studio portrait in soft light",
  masthead: "Auralis",
  issue: "Issue 12",
  bordered: false,
};

export function Media20({
  src,
  alt,
  masthead,
  issue,
  bordered = false,
  className,
}: Media20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("relative h-48 w-36 overflow-hidden rounded-md bg-muted shadow-lg shadow-black/20", bordered && "border border-border")}>
        {src && (
          <img
            src={src}
            alt={alt ?? ""}
            className="absolute inset-0 size-full object-cover"
          />
        )}
        <div
          className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/55 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 top-0 p-2.5 text-center">
          {masthead && (
            <p className="font-serif text-xl font-bold text-white">
              {masthead}
            </p>
          )}
          {issue && (
            <p className="mt-0.5 text-xs font-medium text-white/80">
              {issue}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
