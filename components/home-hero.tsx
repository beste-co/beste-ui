"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { AiMark } from "@/components/beste/component/ai-mark";
import { Button23 } from "@/components/beste/component/button23";
import { StagePanel } from "@/components/beste/component/stage-panel";
import { Ai73, ai73Demo } from "@/components/beste/piece/ai73";
import { Commerce51, commerce51Demo } from "@/components/beste/piece/commerce51";
import { Editor112, editor112Demo } from "@/components/beste/piece/editor112";
import { Form53, form53Demo } from "@/components/beste/piece/form53";
import { Media32, media32Demo } from "@/components/beste/piece/media32";
import { Nav40, nav40Demo } from "@/components/beste/piece/nav40";
import { Notification31, notification31Demo } from "@/components/beste/piece/notification31";
import { HOME_HERO_SCENES, HomeHeroFlatCard, type HomeHeroScene, HomeHeroLayers } from "@/components/home-hero-layers";
import { LoginModal } from "@/components/login-modal";
import { useAuth } from "@/lib/auth-context";
import { DOCS_MCP_HREF, hostedLinkProps } from "@/lib/site-links";
import { cn } from "@/lib/utils";

interface HomeHeroProps {
  /** How many blocks, pieces and components the library holds right now. */
  blocks: number;
  pieces: number;
  components: number;
  className?: string;
}

// A CSS animation, so the copy starts rising at first paint instead of waiting for hydration.
const RISE = "animate-[hero-rise_1s_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none";

// Side cards are whole at the stage's edge and only thin out a little toward the page in the middle
const SIDE_FADE = {
  left: "linear-gradient(to right, #000 60%, rgb(0 0 0 / 0.45) 100%)",
  right: "linear-gradient(to left, #000 60%, rgb(0 0 0 / 0.45) 100%)",
};

// The four side slots, in the order they turn over: where each sits, how large it is drawn and the room it keeps
const SIDE_SLOTS = [
  { side: "left", zoom: 1, className: "h-84" },
  { side: "right", zoom: 1.06, className: "h-88" },
  { side: "left", zoom: 0.8, className: "mr-10 h-68" },
  { side: "right", zoom: 0.82, className: "ml-12 h-70" },
] as const;
// How long the side cards rest before the next slot swaps its card, and how long the swap takes
const SWAP_MS = 3400;
const FADE_MS = 1600;

// Real pieces that take turns with the drawn cards
const SIDE_PIECES = {
  notification31: <Notification31 {...notification31Demo} />,
  form53: <Form53 {...form53Demo} />,
  commerce51: <Commerce51 {...commerce51Demo} />,
  nav40: <Nav40 {...nav40Demo} />,
  ai73: <Ai73 {...ai73Demo} />,
  media32: <Media32 {...media32Demo} />,
  editor112: <Editor112 {...editor112Demo} />,
};
type SideCard = HomeHeroScene | keyof typeof SIDE_PIECES;
const isScene = (card: SideCard): card is HomeHeroScene => (HOME_HERO_SCENES as string[]).includes(card);
// Drawn cards and pieces alternate, so each side always mixes the two
const SIDE_DECK: SideCard[] = ["agent", "form53", "product", "nav40", "plan", "commerce51", "stats", "ai73", "review", "media32", "booking", "editor112", "notification31"];

const SIDE_STYLES = `
@keyframes home-hero-in { from { opacity: 0; filter: blur(14px); transform: translateY(18px) scale(0.97) } }
@keyframes home-hero-out { to { opacity: 0; filter: blur(14px); transform: translateY(-14px) scale(0.97) } }
@media (prefers-reduced-motion: reduce) { .home-hero-in, .home-hero-out { animation: none !important } .home-hero-out { opacity: 0 } }
`;

// The assistants named on the MCP chip, in the order their marks overlap
const AGENTS = ["claude", "cursor", "openai", "gemini"] as const;

/**
 * The site's one hero: centered copy with an MCP chip, over a sky stage where a
 * page taken apart into floating layers stands between four smaller, quieter cards shown flat.
 */
export function HomeHero({ blocks, pieces, components, className }: HomeHeroProps) {
  const router = useRouter();
  const { session, refreshSession } = useAuth();
  const [loginOpen, setLoginOpen] = React.useState(false);
  // Which card each side slot shows and the one it is letting go of; the rest wait in line, so no card is on stage twice
  const [deck, setDeck] = React.useState<{ shown: SideCard[]; leaving: (SideCard | null)[]; waiting: SideCard[]; next: number }>(() => ({
    shown: SIDE_DECK.slice(0, SIDE_SLOTS.length),
    leaving: SIDE_SLOTS.map(() => null),
    waiting: SIDE_DECK.slice(SIDE_SLOTS.length),
    next: 0,
  }));

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setDeck((deck) => {
        const [incoming, ...rest] = deck.waiting;
        const outgoing = deck.shown[deck.next];
        if (!incoming || !outgoing) return deck;
        const shown = [...deck.shown];
        const leaving = [...deck.leaving];
        shown[deck.next] = incoming;
        leaving[deck.next] = outgoing;
        return { shown, leaving, waiting: [...rest, outgoing], next: (deck.next + 1) % SIDE_SLOTS.length };
      });
    }, SWAP_MS);
    return () => window.clearInterval(id);
  }, []);

  const sideCard = (card: SideCard, zoom: number) =>
    isScene(card) ? (
      <HomeHeroFlatCard scene={card} zoom={zoom} />
    ) : (
      // A piece brings its own padding and frosted rim; the box gives it a card's width
      <div style={{ zoom }} className="-m-4 w-80">
        {SIDE_PIECES[card]}
      </div>
    );

  const sideSlot = (index: number) => {
    const slot = SIDE_SLOTS[index];
    const card = deck.shown[index];
    const leaving = deck.leaving[index];
    if (!slot || !card) return null;
    const ease = `${FADE_MS}ms cubic-bezier(0.22, 1, 0.36, 1) both`;
    return (
      <div className={cn("relative flex", slot.side === "left" ? "justify-end" : "justify-start", slot.className)}>
        {/* The card going out dissolves in place while the new one rises through it */}
        {leaving && (
          <div key={`out-${leaving}`} style={{ animation: `home-hero-out ${ease}` }} className={cn("home-hero-out absolute top-0", slot.side === "left" ? "right-0" : "left-0")}>
            {sideCard(leaving, slot.zoom)}
          </div>
        )}
        <div key={card} style={{ animation: `home-hero-in ${ease}` }} className="home-hero-in">
          {sideCard(card, slot.zoom)}
        </div>
      </div>
    );
  };

  // The session is only known on the client, so the label stays the same and the click decides.
  const start = () => {
    if (session?.user) {
      router.push("/blocks");
      return;
    }
    setLoginOpen(true);
  };

  return (
    <section className={cn("mx-auto w-full max-w-6xl px-4 md:px-6", className)}>
      <div className="flex flex-col items-center pt-16 text-center md:pt-20">
        <h1 className={cn("max-w-3xl text-balance text-4xl font-medium leading-none tracking-[-0.04em] md:text-6xl", RISE)}>
          Blocks your agent can build with.
        </h1>

        <p className={cn("mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg", RISE)}>
          <span className="font-medium text-foreground">{blocks}</span> blocks,{" "}
          <span className="font-medium text-foreground">{pieces}</span> pieces and{" "}
          <span className="font-medium text-foreground">{components}</span> components for shadcn/ui and Tailwind. Install one
          with a command, or let your agent pull it in.
        </p>

        <div className={cn("mt-7 flex flex-wrap items-center justify-center gap-3", RISE)}>
          <Button23 size="sm" label="Get started" tone="dark" direction="right" onClick={start} />
        </div>

        {/* The MCP chip: the assistants' marks overlap like a row of faces, then the line that names the protocol */}
        <Link
          href={DOCS_MCP_HREF}
          {...hostedLinkProps}
          className={cn("group/mcp mt-6 inline-flex max-w-full items-center gap-3 rounded-full bg-muted py-1.5 pr-4 pl-1.5 text-sm transition-colors duration-500 hover:bg-foreground/10", RISE)}
        >
          <span aria-hidden="true" className="flex shrink-0">
            {AGENTS.map((brand, index) => (
              <span key={brand} className={cn("flex size-8 items-center justify-center rounded-full bg-background ring-2 ring-muted", index > 0 && "-ml-2")}>
                <AiMark brand={brand} colored={false} label="" className="size-4" />
              </span>
            ))}
          </span>
          <span className="truncate">
            <span className="font-medium">Works over MCP</span>
            <span className="text-muted-foreground"> with Claude Code, Cursor and more</span>
          </span>
          <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover/mcp:translate-x-0.5" />
        </Link>
      </div>

      {/* A picture of the library, not a control: inert keeps the live demos out of the tab order */}
      <StagePanel surface="image" image={{ src: "dawn" }} className={cn("mt-14 h-[30rem] rounded-4xl md:mt-20 md:h-[38rem]", RISE)}>
        <style>{SIDE_STYLES}</style>
        <div inert className="relative flex h-full select-none items-start justify-center px-2 pt-6 md:pt-10">
          {/* The centerpiece: one page taken apart into its layers, floating over the sky */}
          <HomeHeroLayers className="h-full w-full max-w-xl shrink-0 md:w-[36rem]" />
          {/* The side cards run off the stage's edges and fade out toward the page, each at its own size */}
          <div
            style={{ maskImage: SIDE_FADE.left, WebkitMaskImage: SIDE_FADE.left }}
            className="absolute top-6 left-0 hidden origin-left -translate-x-[38%] -skew-y-2 flex-col items-end gap-5 md:flex"
          >
            {sideSlot(0)}
            {sideSlot(2)}
          </div>
          <div
            style={{ maskImage: SIDE_FADE.right, WebkitMaskImage: SIDE_FADE.right }}
            className="absolute top-24 right-0 hidden origin-right translate-x-[42%] skew-y-2 flex-col items-start gap-5 md:flex"
          >
            {sideSlot(3)}
            {sideSlot(1)}
          </div>
        </div>
      </StagePanel>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} onLoginSuccess={refreshSession} />
    </section>
  );
}
