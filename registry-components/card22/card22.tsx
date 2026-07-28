import { cn } from "@/lib/utils";

type Tone = "primary" | "emerald" | "dark";

interface Card22Message {
  text: string;
  /** "them" aligns left on muted, "me" aligns right on the tone color */
  from: "them" | "me";
}

interface Card22Props {
  /** Contact name in the header */
  name?: string;
  /** Muted status line under the name (e.g. "online") */
  status?: string;
  /** Contact avatar URL */
  src?: string;
  /** The conversation, in order */
  messages: Card22Message[];
  /** Show a typing indicator bubble at the end */
  typing?: boolean;
  /** Color of your own bubbles */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  emerald: "bg-emerald-500 text-white",
  dark: "bg-foreground text-background",
};

export const card22Demo: Card22Props = {
  name: "Selin Aksoy",
  status: "online",
  src: "https://i.pravatar.cc/64?img=26",
  messages: [
    { from: "them", text: "The new landing page is live!" },
    { from: "me", text: "Already? That was two days of work at most" },
    { from: "them", text: "Blocks. It is all blocks." },
  ],
  typing: true,
};

/**
 * A chat conversation card: contact header, left and right message bubbles
 * with tails, and a live typing indicator with three bouncing dots. The
 * bounce pauses under reduced motion.
 */
export function Card22({
  name,
  status,
  src,
  messages,
  typing = false,
  tone = "primary",
  className,
}: Card22Props) {
  return (
    <div className={cn("w-full max-w-sm rounded-2xl border bg-card p-4", className)}>
      {(name || src) && (
        <div className="mb-3 flex items-center gap-2.5 border-b pb-3">
          {src && (
            <img
              src={src}
              alt=""
              width={36}
              height={36}
              className="size-9 shrink-0 rounded-full object-cover"
            />
          )}
          <span className="flex min-w-0 flex-col">
            {name && (
              <span className="truncate text-sm font-semibold text-card-foreground">{name}</span>
            )}
            {status && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" />
                {status}
              </span>
            )}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {messages.map((message, i) => (
          <p
            // biome-ignore lint/suspicious/noArrayIndexKey: conversation order is fixed
            key={i}
            className={cn(
              "max-w-[85%] rounded-2xl px-3.5 py-2 text-base leading-snug",
              message.from === "me"
                ? cn("self-end rounded-br-sm", toneStyles[tone])
                : "self-start rounded-bl-sm bg-muted text-foreground"
            )}
          >
            {message.text}
          </p>
        ))}

        {typing && (
          <span
            className="flex w-fit items-center gap-1 self-start rounded-2xl rounded-bl-sm bg-muted px-3.5 py-3"
            role="img"
            aria-label={`${name ?? "Contact"} is typing`}
          >
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                aria-hidden="true"
                className="size-1.5 rounded-full bg-muted-foreground/70 motion-safe:animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </span>
        )}
      </div>
    </div>
  );
}
