"use client";
import { cn } from "@/lib/utils";

interface LogoItem {
  src: string;
  alt: string;
}

interface Socialproof19Props {
  caption?: string;
  logos?: LogoItem[];
  className?: string;
}

export const socialproof19Demo: Socialproof19Props = {
  caption: "Trusted by 40+ studios",
  logos: [
    { src: "https://oud.pics/sm/l/logoipsum-380.png", alt: "Logoipsum" },
    { src: "https://oud.pics/sm/l/logoipsum-388.png", alt: "Logoipsum" },
    { src: "https://oud.pics/sm/l/logoipsum-395.png", alt: "Logoipsum" },
    { src: "https://oud.pics/sm/l/logoipsum-406.png", alt: "Logoipsum" },
    { src: "https://oud.pics/sm/l/logoipsum-410.png", alt: "Logoipsum" },
    { src: "https://oud.pics/sm/l/logoipsum-414.png", alt: "Logoipsum" },
  ],
};

export function Socialproof19({
  caption = "Trusted by",
  logos = [],
  className,
}: Socialproof19Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col items-center gap-6">
        {caption && (
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {caption}
          </span>
        )}
        <div className="grid w-full grid-cols-3 items-center gap-x-6 gap-y-6">
          {logos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center">
              <img
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={28}
                className="h-6 w-auto object-contain opacity-50 grayscale"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
