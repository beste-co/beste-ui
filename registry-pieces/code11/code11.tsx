"use client";

import { cn } from "@/lib/utils";

interface CurlHeader {
  name: string;
  value: string;
}

interface Code11Props {
  method?: string;
  url?: string;
  headers?: CurlHeader[];
  body?: string;
  className?: string;
}

export const code11Demo: Code11Props = {
  method: "POST",
  url: "https://api.beste.co/v1/users",
  headers: [
    { name: "Authorization", value: "Bearer sk_live_..." },
    { name: "Content-Type", value: "application/json" },
  ],
  body: '{"name": "Ada Lovelace"}',
};

export function Code11({
  method = "GET",
  url = "",
  headers = [],
  body,
  className,
}: Code11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-96 rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs leading-relaxed shadow-sm">
        <div className="flex gap-1 truncate">
          <span className="text-card-foreground">curl</span>
          <span className="text-violet-600 dark:text-violet-400">-X</span>
          <span className="text-amber-600 dark:text-amber-400">{method}</span>
          <span className="truncate text-emerald-600 dark:text-emerald-400">
            {url}
          </span>
          <span className="text-muted-foreground" aria-hidden="true">
            \
          </span>
        </div>
        {headers.map((header, i) => {
          const isLast = i === headers.length - 1 && !body;
          return (
            <div key={i} className="flex gap-1 truncate pl-3">
              <span className="text-violet-600 dark:text-violet-400">-H</span>
              <span className="truncate text-emerald-600 dark:text-emerald-400">
                {`"${header.name}: ${header.value}"`}
              </span>
              {!isLast && (
                <span className="text-muted-foreground" aria-hidden="true">
                  \
                </span>
              )}
            </div>
          );
        })}
        {body && (
          <div className="flex gap-1 truncate pl-3">
            <span className="text-violet-600 dark:text-violet-400">-d</span>
            <span className="truncate text-emerald-600 dark:text-emerald-400">
              {`'${body}'`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
