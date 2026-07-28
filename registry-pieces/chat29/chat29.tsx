"use client";
import { Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "received" | "sent";

interface Chat29Props {
  place?: string;
  address?: string;
  distance?: string;
  imageSrc?: string;
  alt?: string;
  role?: Role;
  className?: string;
}

const defaultImage =
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=640&q=80";

export const chat29Demo: Chat29Props = {
  place: "Packer's Coffee",
  address: "Kuloğlu, Turnacıbaşı Cd. 29, 34433 Beyoğlu/İstanbul",
  distance: "0.4 km away",
  imageSrc: defaultImage,
  alt: "Packer's Coffee · interior",
  role: "received",
};

export function Chat29({
  place = "Shared location",
  address,
  distance,
  imageSrc = defaultImage,
  alt,
  role = "received",
  className,
}: Chat29Props) {
  const isSent = role === "sent";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-56 flex-col overflow-hidden rounded-2xl shadow-sm",
          isSent
            ? "ml-auto rounded-br-md bg-primary text-primary-foreground"
            : "mr-auto rounded-bl-md bg-muted text-card-foreground"
        )}
      >
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            src={imageSrc}
            alt={alt ?? place ?? ""}
            className="absolute inset-0 size-full object-cover"
          />
        </div>
        <div className="flex items-start gap-2 px-3 py-2">
          <Navigation
            className={cn(
              "mt-0.5 size-3 shrink-0",
              isSent ? "text-primary-foreground/70" : "text-muted-foreground"
            )}
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-sm font-semibold">{place}</span>
            {address && (
              <span
                className={cn(
                  "line-clamp-2 text-xs leading-snug",
                  isSent
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                )}
              >
                {address}
              </span>
            )}
            {distance && (
              <span
                className={cn(
                  "text-xs font-medium",
                  isSent
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                )}
              >
                {distance}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
