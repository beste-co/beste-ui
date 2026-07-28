import { type LucideIcon, Palmtree } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "sand" | "sky" | "rose";

interface Card15Props {
  /** The handwritten style message on the left half */
  message: string;
  /** Signature under the message (e.g. "Selin") */
  sender?: string;
  /** Name written on the first address line */
  to?: string;
  /** Postmark text around the stamp (e.g. "Alacati, TR") */
  location?: string;
  /** Stamp image URL; falls back to the stamp icon */
  stampSrc?: string;
  /** Stamp icon when there is no image (defaults to Palmtree) */
  stampIcon?: LucideIcon;
  /** Stamp paper tint */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  sand: "bg-amber-50 text-amber-700",
  sky: "bg-sky-50 text-sky-700",
  rose: "bg-rose-50 text-rose-700",
};

export const card15Demo: Card15Props = {
  message: "Wish you were here. The water is unreal and the studio ideas keep coming.",
  sender: "Selin",
  to: "The Beste team",
  location: "Alacati, TR",
};

/**
 * The back of a postcard: a serif message and signature on the left, a
 * dashed-frame stamp with a hand-cancelled postmark and empty address lines
 * on the right. Fixed white paper so it reads as print on both themes.
 */
export function Card15({
  message,
  sender,
  to,
  location,
  stampSrc,
  stampIcon: StampIcon = Palmtree,
  tone = "sand",
  className,
}: Card15Props) {
  return (
    <div
      className={cn(
        "grid aspect-[3/2] w-full max-w-md grid-cols-[1.15fr_1fr] gap-4 bg-white p-5 text-zinc-900 shadow-md",
        className
      )}
    >
      {/* Message half */}
      <div className="flex min-w-0 flex-col justify-between border-r border-zinc-200 pr-4">
        <p className="font-serif text-lg italic leading-relaxed text-zinc-700">{message}</p>
        {sender && (
          <p className="mt-3 font-serif text-lg italic text-zinc-800">With love, {sender}</p>
        )}
      </div>

      {/* Stamp and address half */}
      <div className="flex min-w-0 flex-col justify-between">
        <div className="relative flex justify-end pr-1 pt-1">
          {/* Postmark rings, hand cancelled over the stamp corner */}
          <span
            aria-hidden="true"
            className="absolute -left-1 top-0 size-14 rounded-full border border-dashed border-zinc-300"
          />
          <span
            aria-hidden="true"
            className="absolute left-4 top-5 size-9 rounded-full border border-zinc-200"
          />
          <span
            className={cn(
              "relative flex size-16 rotate-2 items-center justify-center border-2 border-dashed border-zinc-300 p-1",
              toneStyles[tone]
            )}
          >
            {stampSrc ? (
              <img src={stampSrc} alt="" className="absolute inset-0 size-full object-cover p-1" />
            ) : (
              <StampIcon aria-hidden="true" className="size-6" />
            )}
          </span>
        </div>
        {location && (
          <p className="mt-1 text-right font-mono text-sm uppercase tracking-widest text-zinc-400">
            {location}
          </p>
        )}

        <div className="mt-auto flex flex-col gap-3 pt-4">
          <p className="h-5 truncate border-b border-zinc-300 font-serif text-base italic leading-5 text-zinc-700">
            {to}
          </p>
          <span aria-hidden="true" className="h-5 border-b border-zinc-300" />
          <span aria-hidden="true" className="h-5 border-b border-zinc-300" />
        </div>
      </div>
    </div>
  );
}
