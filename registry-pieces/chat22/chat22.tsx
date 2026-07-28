"use client";

import { MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Participant {
  src?: string;
  alt?: string;
  fallback: string;
}

interface Chat22Props {
  replies?: number;
  participants?: Participant[];
  lastReply?: string;
  className?: string;
}

export const chat22Demo: Chat22Props = {
  replies: 12,
  lastReply: "2 min ago",
  participants: [
    {
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
      alt: "Ayşe",
      fallback: "AK",
    },
    {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      alt: "Merve",
      fallback: "MÖ",
    },
    {
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      alt: "Sarah",
      fallback: "SB",
    },
  ],
};

export function Chat22({
  replies = 0,
  participants = [],
  lastReply,
  className,
}: Chat22Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1 text-xs font-medium shadow-sm transition-colors hover:bg-muted"
      >
        <div className="flex items-center -space-x-1.5">
          {participants.slice(0, 3).map((p, i) => (
            <Avatar key={i} className="size-5 border-2 border-card">
              <AvatarImage src={p.src} alt={p.alt} className="object-cover" />
              <AvatarFallback className="text-xs font-semibold">
                {p.fallback}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        <MessageSquare
          className="size-3 text-muted-foreground"
          aria-hidden="true"
        />
        <span className="text-primary">
          {replies} {replies === 1 ? "reply" : "replies"}
        </span>
        {lastReply && (
          <span className="text-muted-foreground">· {lastReply}</span>
        )}
      </button>
    </div>
  );
}
