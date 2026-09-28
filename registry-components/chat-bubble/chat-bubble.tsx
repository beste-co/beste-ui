"use client";

import { CheckCheckIcon, CheckIcon, ClockIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

/** Surface of the other people's bubbles. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Size preset. Mirrors the inspector family; `sm` still sets text-sm. */
type Size = "sm" | "default" | "lg";

export type ChatDelivery = "sending" | "sent" | "delivered" | "read";

export interface ChatPerson {
  id: string;
  name: string;
  avatar?: string;
}

export interface ChatReaction {
  emoji: string;
  count: number;
  /** The reader is one of the people who reacted. */
  mine?: boolean;
}

export interface ChatMessage {
  id: string;
  /** Id of the person who sent it. */
  from: string;
  text: string;
  /** ISO date string or Date. */
  time: string | Date;
  /** Delivery state, shown under the reader's own latest message. */
  status?: ChatDelivery;
  reactions?: ChatReaction[];
}

export interface ChatBubbleProps {
  messages: ChatMessage[];
  /** Everyone who appears in `messages` or `typing`. */
  people: ChatPerson[];
  /** Id of the reader; their messages sit on the right. */
  me: string;
  /** Ids of people typing right now, shown as a bubble of three dots. */
  typing?: string[];
  /** Messages further apart than this, in minutes, start a new group. */
  groupWithin?: number;
  /** Show names above other people's groups. */
  showNames?: boolean;
  /** Called when a reaction chip is pressed. Without it the chips are read-only. */
  onReact?: (messageId: string, emoji: string) => void;
  /** How a message time reads. Runs on the client only, so time zones never split server and client. */
  formatTime?: (date: Date) => string;
  tone?: Tone;
  size?: Size;
  className?: string;
  "aria-label"?: string;
}

export const chatBubbleDemo: ChatBubbleProps = {
  me: "joni",
  people: [
    { id: "joni", name: "Joni Mitchell" },
    {
      id: "miles",
      name: "Miles Davis",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=96&auto=format&fit=crop",
    },
    {
      id: "bjork",
      name: "Björk",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=96&auto=format&fit=crop",
    },
  ],
  messages: [
    {
      id: "1",
      from: "miles",
      text: "Rehearsal moved to Thursday, the room at the Blue Note is free from six.",
      time: "2026-09-27T17:02:00Z",
    },
    {
      id: "2",
      from: "miles",
      text: "Bring the new charts.",
      time: "2026-09-27T17:02:40Z",
      reactions: [{ emoji: "👍", count: 2, mine: true }],
    },
    {
      id: "3",
      from: "joni",
      text: "Thursday works. I finished the arrangement for the second set last night.",
      time: "2026-09-27T17:05:00Z",
    },
    {
      id: "4",
      from: "joni",
      text: "Here it is: https://beste.co/overview",
      time: "2026-09-27T17:05:30Z",
      status: "read",
    },
    {
      id: "5",
      from: "bjork",
      text: "Oh, the modulation into the bridge is lovely. Can we try it a little slower first?",
      time: "2026-09-27T17:09:00Z",
      reactions: [{ emoji: "❤️", count: 1 }],
    },
  ],
  typing: ["miles"],
  className: "w-full max-w-md",
};

const toneStyles: Record<Tone, string> = {
  muted: "bg-muted text-foreground",
  outline: "border border-border bg-background text-foreground",
  ghost: "bg-foreground/5 text-foreground",
};

const sizeStyles: Record<Size, { bubble: string; avatar: string; gutter: string; meta: string }> = {
  sm: { bubble: "px-3 py-1.5 text-sm", avatar: "size-6 text-sm", gutter: "w-6", meta: "text-sm" },
  default: {
    bubble: "px-3.5 py-2 text-sm",
    avatar: "size-8 text-sm",
    gutter: "w-8",
    meta: "text-sm",
  },
  lg: { bubble: "px-4 py-2.5 text-base", avatar: "size-9 text-sm", gutter: "w-9", meta: "text-sm" },
};

// Same spring as inspector-slider: overshoots a hair, then settles, with no animation library
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

const DELIVERY: Record<ChatDelivery, { label: string; Icon: typeof CheckIcon }> = {
  sending: { label: "Sending", Icon: ClockIcon },
  sent: { label: "Sent", Icon: CheckIcon },
  delivered: { label: "Delivered", Icon: CheckCheckIcon },
  read: { label: "Read", Icon: CheckCheckIcon },
};

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

const defaultFormat = (date: Date) =>
  new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date);

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (
    (parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "")
  ).toUpperCase();
}

// Turns bare URLs into links, leaving the rest as plain text
function linkify(text: string) {
  return text.split(URL_PATTERN).map((part, index) =>
    index % 2 === 1 ? (
      <a
        key={index}
        href={part}
        target="_blank"
        rel="noreferrer noopener"
        className="cursor-pointer break-all underline decoration-current/40 underline-offset-2 hover:decoration-current"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}

type Position = "single" | "first" | "middle" | "last";

// The corner on the author's side tightens where bubbles meet, so a run reads as one voice
function corners(position: Position, own: boolean) {
  const side = own
    ? {
        first: "rounded-br-md",
        middle: "rounded-r-md",
        last: "rounded-tr-md",
        single: "rounded-br-md",
      }
    : {
        first: "rounded-bl-md",
        middle: "rounded-l-md",
        last: "rounded-tl-md",
        single: "rounded-bl-md",
      };
  return cn("rounded-2xl", side[position]);
}

interface Group {
  key: string;
  from: string;
  messages: ChatMessage[];
  typing: boolean;
}

export function ChatBubble({
  messages,
  people,
  me,
  typing = [],
  groupWithin = 5,
  showNames = true,
  onReact,
  formatTime = defaultFormat,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel = "Messages",
}: ChatBubbleProps) {
  const styles = sizeStyles[size];
  const byId = React.useMemo(() => new Map(people.map((person) => [person.id, person])), [people]);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const groups = React.useMemo(() => {
    const list: Group[] = [];
    let previous: { from: string; at: number } | null = null;
    for (const message of messages) {
      const at = new Date(message.time).getTime();
      const current = list[list.length - 1];
      if (
        current &&
        previous &&
        previous.from === message.from &&
        at - previous.at <= groupWithin * 60_000
      ) {
        current.messages.push(message);
      } else {
        list.push({ key: message.id, from: message.from, messages: [message], typing: false });
      }
      previous = { from: message.from, at };
    }
    // A typing person joins their own group if they spoke last, otherwise gets a group of their own
    for (const id of typing) {
      const last = list[list.length - 1];
      if (last && last.from === id) last.typing = true;
      else list.push({ key: `typing-${id}`, from: id, messages: [], typing: true });
    }
    return list;
  }, [messages, typing, groupWithin]);

  // The reader's latest message carries the delivery state for everything before it
  const lastOwnId = React.useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message && message.from === me) return message.id;
    }
    return null;
  }, [messages, me]);

  const listRef = React.useRef<HTMLDivElement>(null);
  const [focusIndex, setFocusIndex] = React.useState(-1);
  const flat = messages.map((message) => message.id);
  const indexOf = new Map(flat.map((id, index) => [id, index]));
  const tabTarget = focusIndex >= 0 ? flat[focusIndex] : flat[flat.length - 1];

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>("[data-slot=chat-bubble-message]") ?? []
    );
    const current = items.findIndex((item) => item === document.activeElement);
    if (current < 0) return;
    event.preventDefault();
    const last = items.length - 1;
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? last
          : event.key === "ArrowUp"
            ? Math.max(0, current - 1)
            : Math.min(last, current + 1);
    items[next]?.focus();
    setFocusIndex(next);
  };

  return (
    <div
      ref={listRef}
      role="log"
      aria-label={ariaLabel}
      data-slot="chat-bubble"
      onKeyDown={onKeyDown}
      className={cn("flex w-full flex-col gap-4", className)}
      style={{ "--chat-ease": SPRING_EASE } as React.CSSProperties}
    >
      <style>
        {
          "@keyframes chat-bubble-dot{0%,60%,100%{transform:translateY(0);opacity:.45}30%{transform:translateY(-3px);opacity:1}}"
        }
      </style>
      {groups.map((group) => {
        const own = group.from === me;
        const person = byId.get(group.from);
        const name = person?.name ?? group.from;
        const count = group.messages.length + (group.typing ? 1 : 0);

        return (
          <div
            key={group.key}
            data-slot="chat-bubble-group"
            data-own={own}
            className={cn("flex items-end gap-2", own && "flex-row-reverse")}
          >
            {!own && (
              <div className={cn("shrink-0 self-end", styles.gutter)}>
                {person?.avatar ? (
                  // biome-ignore lint/performance/noImgElement: plain img keeps the component framework-free
                  <img
                    src={person.avatar}
                    alt=""
                    className={cn("rounded-full object-cover", styles.avatar)}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid place-items-center rounded-full bg-foreground/10 font-medium select-none",
                      styles.avatar
                    )}
                  >
                    {initials(name)}
                  </span>
                )}
              </div>
            )}

            <div
              className={cn(
                "flex max-w-[78%] min-w-0 flex-col gap-1",
                own ? "items-end" : "items-start"
              )}
            >
              {showNames && !own && (
                <span className={cn("px-1 text-muted-foreground select-none", styles.meta)}>
                  {name}
                </span>
              )}

              {group.messages.map((message, index) => {
                const position: Position =
                  count === 1
                    ? "single"
                    : index === 0
                      ? "first"
                      : index === count - 1
                        ? "last"
                        : "middle";
                const date = new Date(message.time);
                const delivery =
                  own && message.id === lastOwnId && message.status
                    ? DELIVERY[message.status]
                    : null;
                const reactions = message.reactions?.filter((reaction) => reaction.count > 0) ?? [];
                const itemIndex = indexOf.get(message.id) ?? 0;

                return (
                  <div
                    key={message.id}
                    className={cn("flex w-full flex-col gap-1", own ? "items-end" : "items-start")}
                  >
                    <div
                      className={cn(
                        "group/message flex items-center gap-2",
                        own && "flex-row-reverse"
                      )}
                    >
                      <div
                        role="article"
                        data-slot="chat-bubble-message"
                        data-position={position}
                        tabIndex={message.id === tabTarget ? 0 : -1}
                        onFocus={() => setFocusIndex(itemIndex)}
                        aria-label={`${name}: ${message.text}`}
                        className={cn(
                          "min-w-0 break-words whitespace-pre-wrap outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                          corners(position, own),
                          own ? "bg-primary text-primary-foreground" : toneStyles[tone],
                          styles.bubble
                        )}
                      >
                        {linkify(message.text)}
                      </div>
                      {/* The time slides out beside the bubble on hover or focus */}
                      <time
                        dateTime={date.toISOString()}
                        className={cn(
                          "shrink-0 text-muted-foreground opacity-0 select-none",
                          own ? "translate-x-1" : "-translate-x-1",
                          "motion-safe:transition-[opacity,translate] motion-safe:duration-500 motion-safe:ease-(--chat-ease)",
                          "group-hover/message:translate-x-0 group-hover/message:opacity-100 group-has-[:focus-visible]/message:translate-x-0 group-has-[:focus-visible]/message:opacity-100",
                          styles.meta
                        )}
                      >
                        {mounted ? formatTime(date) : ""}
                      </time>
                    </div>

                    {reactions.length > 0 && (
                      <div className={cn("-mt-2 flex flex-wrap gap-1 px-2", own && "justify-end")}>
                        {reactions.map((reaction) => {
                          const label = `${reaction.emoji} ${reaction.count}${reaction.mine ? ", including you" : ""}`;
                          const chip = cn(
                            "flex h-6 items-center gap-1 rounded-full border px-2 text-sm tabular-nums shadow-sm select-none",
                            reaction.mine
                              ? "border-primary/40 bg-primary/10 text-foreground"
                              : "border-border bg-background text-muted-foreground"
                          );
                          return onReact ? (
                            <button
                              key={reaction.emoji}
                              type="button"
                              aria-pressed={reaction.mine ?? false}
                              aria-label={label}
                              onClick={() => onReact(message.id, reaction.emoji)}
                              className={cn(
                                chip,
                                "cursor-pointer outline-none transition-colors hover:border-foreground/30 focus-visible:ring-2 focus-visible:ring-ring/50"
                              )}
                            >
                              <span aria-hidden="true">{reaction.emoji}</span>
                              <span aria-hidden="true">{reaction.count}</span>
                            </button>
                          ) : (
                            <span
                              key={reaction.emoji}
                              role="img"
                              aria-label={label}
                              className={chip}
                            >
                              <span aria-hidden="true">{reaction.emoji}</span>
                              <span aria-hidden="true">{reaction.count}</span>
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {delivery && (
                      <span
                        className={cn(
                          "flex items-center gap-1 px-1 text-muted-foreground select-none",
                          styles.meta
                        )}
                      >
                        <delivery.Icon
                          aria-hidden="true"
                          className={cn("size-3.5", message.status === "read" && "text-primary")}
                        />
                        {delivery.label}
                      </span>
                    )}
                  </div>
                );
              })}

              {group.typing && (
                <div
                  role="status"
                  aria-label={`${name} is typing`}
                  className={cn(
                    "flex items-center gap-1",
                    corners(count === 1 ? "single" : "last", own),
                    own ? "bg-primary text-primary-foreground" : toneStyles[tone],
                    styles.bubble
                  )}
                >
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      aria-hidden="true"
                      className="my-1.5 size-1.5 rounded-full bg-current opacity-60 motion-safe:animate-[chat-bubble-dot_1.2s_ease-in-out_infinite]"
                      style={{ animationDelay: `${dot * 0.15}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
