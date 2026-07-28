"use client";
import { cn } from "@/lib/utils";

interface Notification4Props {
  sender?: string;
  message?: string;
  initials?: string;
  time?: string;
  unread?: boolean;
  image?: string;
  className?: string;
}

export const notification4Demo: Notification4Props = {
  sender: "Elena Park",
  message: "Just pushed the redesign. Take a look when you have a sec 🙌",
  initials: "EP",
  time: "2m",
  unread: true,
  image:
    "https://images.unsplash.com/photo-1717853358193-216ad30189ab?w=80&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWxlbmF8ZW58MHx8MHx8fDA%3D",
};

export function Notification4({
  sender,
  message,
  initials = "??",
  time,
  unread = false,
  image,
  className,
}: Notification4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-start gap-3 rounded-lg border border-border bg-card p-3 shadow-lg">
        <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-semibold text-muted-foreground">
          {image ? (
            <img
              src={image}
              alt={sender ?? ""}
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            {sender && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {sender}
              </span>
            )}
            {time && (
              <span className="shrink-0 text-xs text-muted-foreground">
                {time}
              </span>
            )}
          </div>
          {message && (
            <span className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {message}
            </span>
          )}
        </div>
        {unread && (
          <span
            className="mt-1.5 size-2 shrink-0 rounded-full bg-sky-500"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
