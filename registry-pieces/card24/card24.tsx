"use client";
import { cn } from "@/lib/utils";

interface Report {
  name: string;
  role: string;
  initials: string;
  image?: string;
}

interface Card24Props {
  manager?: {
    name: string;
    role: string;
    initials: string;
    image?: string;
  };
  reports?: Report[];
  className?: string;
}

export const card24Demo: Card24Props = {
  manager: {
    name: "Kian Okafor",
    role: "VP Engineering",
    initials: "KO",
    image:
      "https://images.unsplash.com/photo-1611695434369-a8f5d76ceb7b?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQ3fHxwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
  },
  reports: [
    {
      name: "Andrea Kim",
      role: "Staff eng",
      initials: "AK",
      image:
        "https://images.unsplash.com/photo-1558507652-2d9626c4e67a?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjU5fHxwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
    },
    { name: "Beste Sözen", role: "Design lead", initials: "BS" },
    {
      name: "Jules Park",
      role: "Sr. PM",
      initials: "JP",
      image:
        "https://images.unsplash.com/photo-1674932668403-33398b81c92f?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjYzfHxwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
    },
  ],
};

export function Card24({
  manager,
  reports = [],
  className,
}: Card24Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col items-center rounded-xl border border-border bg-card p-3 shadow-sm">
        {manager && (
          <div className="flex flex-col items-center gap-1">
            <div className="relative flex size-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white shadow-md">
              {manager.image ? (
                <img
                  src={manager.image}
                  alt={manager.name}
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                manager.initials
              )}
            </div>
            <span className="text-sm font-semibold text-card-foreground">
              {manager.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {manager.role}
            </span>
          </div>
        )}
        <div className="mt-2 flex w-2/3 flex-col items-stretch">
          <span
            className="h-4 w-px self-center bg-border"
            aria-hidden="true"
          />
          <span className="h-px w-full bg-border" aria-hidden="true" />
          <div className="flex justify-between">
            <span className="h-4 w-px bg-border" aria-hidden="true" />
            <span className="h-4 w-px bg-border" aria-hidden="true" />
            <span className="h-4 w-px bg-border" aria-hidden="true" />
          </div>
        </div>
        <div className="flex w-full items-start justify-between gap-2">
          {reports.map((r, idx) => (
            <div
              key={idx}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <div className="relative flex size-8 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-semibold text-card-foreground">
                {r.image ? (
                  <img
                    src={r.image}
                    alt={r.name}
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : (
                  r.initials
                )}
              </div>
              <span className="truncate text-xs font-medium text-card-foreground">
                {r.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {r.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
