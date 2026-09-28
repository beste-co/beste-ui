"use client";

import { Apple, Clock, Hand, Heart, Lightbulb, type LucideIcon, Music, PawPrint, Plane, Search, Smile } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface treatment of the panel. */
type Tone = "muted" | "outline" | "ghost";

/** Density preset. */
type Size = "sm" | "default" | "lg";

/** 0 is the default yellow; 1 to 5 are the Fitzpatrick modifiers from light to dark. */
export type SkinTone = 0 | 1 | 2 | 3 | 4 | 5;

export interface EmojiEntry {
  emoji: string;
  name: string;
  keywords: string[];
  category: string;
  /** Takes a skin tone modifier. */
  tones: boolean;
}

export interface EmojiCategory {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface ReactionPickerProps {
  /** Called with the emoji (skin tone applied) and its entry. */
  onSelect?: (emoji: string, entry: EmojiEntry) => void;
  /** Skin tone for emoji that take one. Pair with `onSkinToneChange` to control it. */
  skinTone?: SkinTone;
  defaultSkinTone?: SkinTone;
  onSkinToneChange?: (tone: SkinTone) => void;
  /** Show the recently used row, remembered in localStorage. */
  recent?: boolean;
  /** localStorage key for recent picks and the skin tone. */
  storageKey?: string;
  /** How many recent picks to keep. */
  maxRecent?: number;
  /** Emoji per row. */
  columns?: number;
  placeholder?: string;
  autoFocus?: boolean;
  tone?: Tone;
  size?: Size;
  className?: string;
  /** Accessible name for the panel. */
  "aria-label"?: string;
}

export const reactionPickerDemo: ReactionPickerProps = {
  onSelect: (emoji) => console.log("Picked", emoji),
  tone: "outline",
};

/* -------------------------------------------------------------------------- */
/* Data                                                                       */
/* -------------------------------------------------------------------------- */

// One line per emoji: "emoji name|keywords". A leading + marks emoji that take a skin tone.
const RAW: { id: string; label: string; icon: LucideIcon; list: string }[] = [
  {
    id: "smileys",
    label: "Smileys",
    icon: Smile,
    list: `😀 grinning face|smile happy joy
😃 big grin|smile happy
😄 grinning eyes|smile laugh
😁 beaming|grin teeth
😆 squinting laugh|laugh lol
😅 sweat smile|relief nervous
🤣 rolling laughing|lol rofl
😂 tears of joy|laugh lol cry
🙂 slight smile|ok fine
🙃 upside down|silly sarcasm
😉 wink|flirt joke
😊 blush|smile shy happy
😇 halo|angel innocent
🥰 smiling with hearts|love adore
😍 heart eyes|love crush
🤩 star struck|wow amazing
😘 kiss|love blow
😋 yum|tasty delicious
😛 tongue out|playful
😜 winking tongue|crazy playful
🤪 zany|crazy wild
🤑 money mouth|rich cash
🤗 hug|hugging thanks
🤭 hand over mouth|oops giggle
🤫 shush|quiet secret
🤔 thinking|hmm wonder
🤐 zipper mouth|secret silent
🤨 raised eyebrow|skeptic doubt
😐 neutral|meh blank
😑 expressionless|blank meh
😶 no mouth|speechless silent
😏 smirk|smug
😒 unamused|meh annoyed
🙄 eye roll|whatever annoyed
😬 grimace|awkward yikes
😌 relieved|calm content
😔 pensive|sad thoughtful
😪 sleepy|tired
🤤 drooling|want hungry
😴 sleeping|zzz tired
😷 face mask|sick ill
🤒 thermometer|sick fever
🤕 head bandage|hurt injured
🤢 nauseated|sick gross
🤮 vomiting|sick gross
🥵 hot face|heat sweat
🥶 cold face|freezing
🥴 woozy|dizzy drunk
😵 dizzy face|knocked out
🤯 mind blown|shock wow
🤠 cowboy|yeehaw
🥳 partying|celebrate birthday
😎 sunglasses|cool
🤓 nerd|geek smart
🧐 monocle|inspect curious
😕 confused|unsure
😟 worried|concern
🙁 frown|sad
😮 open mouth|surprised wow
😯 hushed|surprised
😲 astonished|shock wow
😳 flushed|embarrassed
🥺 pleading|puppy eyes please
😦 frowning|shock
😧 anguished|pain
😨 fearful|scared
😰 anxious|nervous sweat
😥 sad but relieved|phew
😢 crying|sad tear
😭 sobbing|cry sad
😱 screaming|fear shock
😖 confounded|frustrated
😣 persevering|struggle
😞 disappointed|sad
😓 downcast|tired sweat
😩 weary|tired
😫 tired face|exhausted
🥱 yawning|bored tired
😤 huffing|triumph frustrated
😡 pouting|angry mad
😠 angry|mad
🤬 cursing|swear angry
😈 smiling devil|evil mischief
💀 skull|dead lol
💩 pile of poo|poop
🤡 clown|joke
👻 ghost|boo halloween
👽 alien|ufo space
🤖 robot|bot ai
😺 grinning cat|cat happy
😻 heart eyes cat|cat love`,
  },
  {
    id: "people",
    label: "People",
    icon: Hand,
    list: `+👋 waving hand|hello hi bye
+🤚 raised back of hand|stop
+✋ raised hand|high five stop
+🖖 vulcan salute|spock
+👌 ok hand|perfect fine
+🤌 pinched fingers|what italian
+✌️ victory hand|peace
+🤞 crossed fingers|luck hope
+🤟 love you gesture|rock
+🤘 sign of the horns|rock metal
+🤙 call me hand|shaka hang loose
+👈 pointing left|left
+👉 pointing right|right
+👆 pointing up|up
+👇 pointing down|down
+☝️ index pointing up|one first
+👍 thumbs up|like yes approve
+👎 thumbs down|dislike no
+✊ raised fist|power solidarity
+👊 fist bump|punch
+👏 clapping hands|applause bravo
+🙌 raising hands|hooray praise
+👐 open hands|hug
+🤲 palms up together|please
🤝 handshake|deal agree
+🙏 folded hands|thanks please pray
+✍️ writing hand|write sign
+💪 flexed biceps|strong power
🦾 mechanical arm|strong
+👂 ear|listen hear
🧠 brain|smart think
👀 eyes|look see watch
👁️ eye|see
👄 mouth|lips kiss
+👶 baby|child
+🧒 child|kid
+🧑 person|adult
+👩 woman|lady
+👨 man|guy
+🧓 older person|elder
+💃 woman dancing|dance party
+🕺 man dancing|dance disco
👯 people with bunny ears|dance party
+🙋 raising hand|question me
+🙇 bowing|sorry respect
+🤦 facepalm|ugh
+🤷 shrug|dunno whatever
+🧘 lotus position|yoga meditate
+🏃 running|run hurry
+🚶 walking|walk
🗣️ speaking head|talk speak
👥 silhouettes|people users`,
  },
  {
    id: "nature",
    label: "Animals and nature",
    icon: PawPrint,
    list: `🐶 dog|puppy pet
🐱 cat|kitten pet
🐭 mouse|small
🐹 hamster|pet
🐰 rabbit|bunny
🦊 fox|clever
🐻 bear|animal
🐼 panda|animal
🐨 koala|animal
🐯 tiger|animal
🦁 lion|king
🐮 cow|farm
🐷 pig|farm
🐸 frog|animal
🐵 monkey|animal
🙈 see no evil|monkey shy
🙉 hear no evil|monkey
🙊 speak no evil|monkey secret
🐔 chicken|farm
🐧 penguin|cold
🐦 bird|tweet
🦉 owl|night wise
🦄 unicorn|magic
🐝 bee|honey
🦋 butterfly|pretty
🐢 turtle|slow
🐍 snake|animal
🐙 octopus|sea
🐬 dolphin|sea
🐳 whale|sea
🦈 shark|sea
🌵 cactus|desert
🌲 evergreen tree|forest
🌴 palm tree|beach
🍀 four leaf clover|luck
🍁 maple leaf|autumn fall
🌸 cherry blossom|spring flower
🌹 rose|flower love
🌻 sunflower|flower
🌈 rainbow|pride colors
☀️ sun|sunny weather
🌙 crescent moon|night
⭐ star|favorite
🌟 glowing star|shine
⚡ high voltage|lightning zap
🔥 fire|hot lit
🌊 water wave|ocean sea
❄️ snowflake|cold winter
☁️ cloud|weather
🌧️ rain cloud|weather`,
  },
  {
    id: "food",
    label: "Food and drink",
    icon: Apple,
    list: `🍎 red apple|fruit
🍐 pear|fruit
🍊 tangerine|orange citrus
🍋 lemon|sour citrus
🍌 banana|fruit
🍉 watermelon|summer fruit
🍇 grapes|fruit wine
🍓 strawberry|fruit
🫐 blueberries|fruit
🍒 cherries|fruit
🍑 peach|fruit
🥭 mango|fruit
🍍 pineapple|fruit
🥥 coconut|fruit
🥑 avocado|toast
🍅 tomato|vegetable
🌶️ hot pepper|spicy
🌽 corn|vegetable
🥕 carrot|vegetable
🥐 croissant|breakfast
🥖 baguette|bread
🧀 cheese|food
🍳 cooking|egg breakfast
🥞 pancakes|breakfast
🍔 hamburger|burger
🍟 french fries|fries
🍕 pizza|slice
🌮 taco|mexican
🍣 sushi|japanese
🍜 steaming bowl|ramen noodles
🍿 popcorn|movie
🍩 doughnut|donut
🍪 cookie|biscuit
🎂 birthday cake|party
🍰 shortcake|cake dessert
🍫 chocolate bar|sweet
🍦 soft ice cream|dessert
☕ hot beverage|coffee tea
🍵 teacup|tea green
🍺 beer mug|beer
🍻 clinking beer mugs|cheers
🥂 clinking glasses|cheers toast champagne
🍷 wine glass|wine
🍸 cocktail glass|martini
🧃 beverage box|juice`,
  },
  {
    id: "music",
    label: "Music and activities",
    icon: Music,
    list: `🎵 musical note|music song
🎶 musical notes|music song
🎤 microphone|sing karaoke
🎧 headphones|music listen
🎼 musical score|music sheet
🎹 musical keyboard|piano keys
🥁 drum|beat percussion
🎷 saxophone|jazz
🎺 trumpet|brass jazz
🎸 guitar|rock
🪕 banjo|folk
🎻 violin|classical strings
🪘 long drum|percussion
📻 radio|station
🎙️ studio microphone|podcast record
💿 optical disc|cd album
📀 dvd|disc
🎚️ level slider|mixer
🎛️ control knobs|mixer
🎬 clapper board|film movie
🎨 artist palette|art paint
🎭 performing arts|theater drama
🎪 circus tent|show
🎟️ admission tickets|ticket event gig
🎫 ticket|gig concert
🏆 trophy|win award
🥇 first place medal|gold win
🎯 direct hit|bullseye target goal
🎮 video game|gaming controller
🎲 game die|dice
🧩 puzzle piece|jigsaw
⚽ soccer ball|football
🏀 basketball|sport
🎾 tennis|sport
+🏄 surfing|surf wave
+🚴 biking|cycling bike
🎉 party popper|celebrate tada
🎊 confetti ball|celebrate party
🎈 balloon|party birthday
🎁 wrapped gift|present`,
  },
  {
    id: "travel",
    label: "Travel and places",
    icon: Plane,
    list: `🚗 car|drive
🚕 taxi|cab
🚌 bus|transit
🚆 train|rail
🚇 metro|subway
✈️ airplane|flight travel
🛫 departure|flight takeoff
🚀 rocket|launch ship
🛸 flying saucer|ufo
🚲 bicycle|bike
🛵 scooter|moped
⛵ sailboat|boat
🗺️ world map|travel
🧭 compass|direction
🏔️ snowy mountain|peak
🏕️ camping|tent
🏖️ beach with umbrella|vacation
🏝️ desert island|vacation
🏙️ cityscape|city
🌃 night with stars|night city
🌅 sunrise|morning
🏠 house|home
🏟️ stadium|arena concert
🗽 statue of liberty|new york
🗼 tokyo tower|japan
🎡 ferris wheel|fair`,
  },
  {
    id: "objects",
    label: "Objects",
    icon: Lightbulb,
    list: `📱 mobile phone|phone
💻 laptop|computer
⌨️ keyboard|type
🖥️ desktop computer|screen
📷 camera|photo
📸 camera with flash|photo
🎥 movie camera|film video
📺 television|tv
💡 light bulb|idea
🔦 flashlight|torch
📚 books|read study
📖 open book|read
✏️ pencil|write edit
🖊️ pen|write
📝 memo|note write
📌 pushpin|pin
📎 paperclip|attach
✂️ scissors|cut
📅 calendar|date
⏰ alarm clock|time wake
⌛ hourglass|time wait
🔑 key|lock password
🔒 locked|secure private
🔔 bell|notification
📣 megaphone|announce
💼 briefcase|work
💰 money bag|cash rich
💸 money with wings|spend
🛒 shopping cart|shop
🎒 backpack|school
👓 glasses|read
🧢 billed cap|hat
👟 running shoe|sneaker`,
  },
  {
    id: "symbols",
    label: "Symbols",
    icon: Heart,
    list: `❤️ red heart|love
🧡 orange heart|love
💛 yellow heart|love
💚 green heart|love
💙 blue heart|love
💜 purple heart|love
🖤 black heart|love
🤍 white heart|love
💔 broken heart|sad
💕 two hearts|love
💖 sparkling heart|love
💯 hundred points|perfect score
✨ sparkles|magic shine new
💫 dizzy|sparkle star
💥 collision|boom
💬 speech balloon|comment chat
💭 thought balloon|think
💤 zzz|sleep
✅ check mark button|done yes
☑️ check box|done
✔️ check mark|done
❌ cross mark|no wrong
❗ exclamation mark|important
❓ question mark|what
⚠️ warning|caution
🚫 prohibited|no forbidden
♻️ recycling|recycle
🔄 counterclockwise arrows|refresh repeat
➕ plus|add
➖ minus|remove
🆗 ok button|ok
🆕 new button|new
🔝 top arrow|best
🟢 green circle|online
🔴 red circle|live record
🟡 yellow circle|away
🏳️‍🌈 rainbow flag|pride
🏁 chequered flag|finish race`,
  },
];

export const emojiCategories: EmojiCategory[] = RAW.map(({ id, label, icon }) => ({ id, label, icon }));

export const emojiData: EmojiEntry[] = RAW.flatMap(({ id, list }) =>
  list.split("\n").map((line) => {
    const tones = line.startsWith("+");
    const body = tones ? line.slice(1) : line;
    const space = body.indexOf(" ");
    const [name = "", keywords = ""] = body.slice(space + 1).split("|");
    return { emoji: body.slice(0, space), name, keywords: keywords.split(" ").filter(Boolean), category: id, tones };
  }),
);

const byEmoji = new Map(emojiData.map((entry) => [entry.emoji, entry]));

const MODIFIERS = ["\u{1F3FB}", "\u{1F3FC}", "\u{1F3FD}", "\u{1F3FE}", "\u{1F3FF}"];
const TONE_NAMES = ["Default", "Light", "Medium light", "Medium", "Medium dark", "Dark"];

/** The emoji with a skin tone modifier; the variation selector gives way to the modifier. */
export function withSkinTone(emoji: string, tone: SkinTone) {
  const modifier = MODIFIERS[tone - 1];
  return modifier ? emoji.replace(/️/g, "") + modifier : emoji;
}

/** Entries matching every word of the query, name starts first. */
export function searchEmoji(query: string, data: EmojiEntry[] = emojiData) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const scored: { entry: EmojiEntry; score: number }[] = [];
  for (const entry of data) {
    const tokens = [...entry.name.split(" "), ...entry.keywords];
    if (!words.every((word) => entry.name.includes(word) || tokens.some((token) => token.startsWith(word)))) continue;
    const first = words[0] ?? "";
    scored.push({ entry, score: entry.name.startsWith(first) ? 0 : tokens.some((t) => t.startsWith(first)) ? 1 : 2 });
  }
  return scored.sort((a, b) => a.score - b.score).map((s) => s.entry);
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

// Concentric corners: the 8px field and cells plus the 8px inset make 16px; outline adds its 1px border
const toneStyles: Record<Tone, { panel: string; header: string; field: string }> = {
  muted: { panel: "bg-muted", header: "bg-muted", field: "bg-background" },
  outline: { panel: "rounded-[17px] border border-border bg-popover text-popover-foreground shadow-lg", header: "bg-popover", field: "bg-muted" },
  ghost: { panel: "", header: "bg-background", field: "bg-muted" },
};

// Cells have a fixed size, so the panel's width is exactly its columns and never stretches
const sizeStyles: Record<Size, { root: string; cell: string; emoji: string; area: string; preview: string }> = {
  sm: { root: "[--picker-cell:--spacing(8)]", cell: "size-8", emoji: "text-lg", area: "h-60", preview: "text-2xl" },
  default: { root: "[--picker-cell:--spacing(9)]", cell: "size-9", emoji: "text-xl", area: "h-72", preview: "text-3xl" },
  lg: { root: "[--picker-cell:--spacing(11)]", cell: "size-11", emoji: "text-2xl", area: "h-80", preview: "text-4xl" },
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

interface Section {
  id: string;
  label: string;
  items: EmojiEntry[];
}

interface PreviewHandle {
  show: (entry: EmojiEntry | null) => void;
}

/** The hovered or focused emoji, in its own state so hovering never re-renders the grid. */
function PreviewBar({ ref, skinTone, size }: { ref: React.Ref<PreviewHandle>; skinTone: SkinTone; size: Size }) {
  const [entry, setEntry] = React.useState<EmojiEntry | null>(null);
  React.useImperativeHandle(ref, () => ({ show: setEntry }), []);
  return (
    <div aria-hidden="true" className="flex h-14 shrink-0 items-center gap-3 border-t border-border/60 px-3">
      {entry ? (
        <>
          <span key={entry.emoji} className={cn("leading-none motion-safe:transition-[scale,opacity] motion-safe:duration-300 motion-safe:starting:scale-75 starting:opacity-0", sizeStyles[size].preview)} style={{ transitionTimingFunction: SPRING_EASE }}>
            {entry.tones ? withSkinTone(entry.emoji, skinTone) : entry.emoji}
          </span>
          <span className="min-w-0 select-none truncate text-sm font-medium capitalize">{entry.name}</span>
        </>
      ) : (
        <span className="select-none text-sm text-muted-foreground">Pick an emoji</span>
      )}
    </div>
  );
}

export function ReactionPicker({
  onSelect,
  skinTone: skinToneProp,
  defaultSkinTone = 0,
  onSkinToneChange,
  recent = true,
  storageKey = "beste:reaction-picker",
  maxRecent = 16,
  columns = 8,
  placeholder = "Search emoji",
  autoFocus = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel = "Emoji picker",
}: ReactionPickerProps) {
  const [query, setQuery] = React.useState("");
  const [innerTone, setInnerTone] = React.useState<SkinTone>(defaultSkinTone);
  const skinTone = skinToneProp ?? innerTone;
  const [toneOpen, setToneOpen] = React.useState(false);
  // Recent picks are read after mount and shown as they were on open, so a pick never shifts the grid under the pointer
  const [recentShown, setRecentShown] = React.useState<string[]>([]);
  const recentStore = React.useRef<string[]>([]);
  const [active, setActive] = React.useState<string>("");
  const [focusIndex, setFocusIndex] = React.useState(0);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const toneButtonRef = React.useRef<HTMLButtonElement>(null);
  const cellRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const sectionRefs = React.useRef(new Map<string, HTMLElement>());
  const previewRef = React.useRef<PreviewHandle>(null);
  const lockUntil = React.useRef(0);
  const id = React.useId();
  const callbacks = React.useRef({ onSelect, onSkinToneChange });
  callbacks.current = { onSelect, onSkinToneChange };

  React.useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(`${storageKey}:recent`) ?? "[]");
      if (Array.isArray(stored)) {
        const list = stored.filter((e): e is string => typeof e === "string" && byEmoji.has(e)).slice(0, maxRecent);
        recentStore.current = list;
        setRecentShown(list);
      }
      const storedTone = Number(window.localStorage.getItem(`${storageKey}:tone`));
      if (skinToneProp === undefined && storedTone >= 1 && storedTone <= 5) setInnerTone(storedTone as SkinTone);
    } catch {
      // Storage can be unavailable in private modes; the picker simply starts fresh
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: read once on mount
  }, [storageKey]);

  const setSkinTone = (next: SkinTone) => {
    if (skinToneProp === undefined) setInnerTone(next);
    callbacks.current.onSkinToneChange?.(next);
    try {
      window.localStorage.setItem(`${storageKey}:tone`, String(next));
    } catch {}
  };

  const sections = React.useMemo<Section[]>(() => {
    if (query.trim()) return [{ id: "search", label: "Search results", items: searchEmoji(query) }];
    const list: Section[] = [];
    if (recent && recentShown.length > 0) {
      list.push({ id: "recent", label: "Recently used", items: recentShown.flatMap((e) => byEmoji.get(e) ?? []) });
    }
    for (const category of emojiCategories) {
      list.push({ id: category.id, label: category.label, items: emojiData.filter((e) => e.category === category.id) });
    }
    return list;
  }, [query, recent, recentShown]);

  const tabs = React.useMemo(
    () => [...(recent && recentShown.length > 0 ? [{ id: "recent", label: "Recently used", icon: Clock }] : []), ...emojiCategories],
    [recent, recentShown.length],
  );

  // Flat order plus row and column for every cell, so arrows can move by row across sections
  const cells = React.useMemo(() => {
    const out: { entry: EmojiEntry; row: number; col: number }[] = [];
    let row = 0;
    for (const section of sections) {
      section.items.forEach((entry, i) => {
        out.push({ entry, row: row + Math.floor(i / columns), col: i % columns });
      });
      row += Math.ceil(section.items.length / columns);
    }
    return out;
  }, [sections, columns]);

  React.useEffect(() => {
    setFocusIndex(0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [query]);

  // The category whose section crosses the top band of the scroll area is the current tab
  React.useEffect(() => {
    const root = scrollRef.current;
    if (!root || query.trim()) return;
    const inBand = new Set<string>();
    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          const sectionId = (record.target as HTMLElement).dataset.section ?? "";
          if (record.isIntersecting) inBand.add(sectionId);
          else inBand.delete(sectionId);
        }
        if (performance.now() < lockUntil.current) return;
        const first = sections.find((s) => inBand.has(s.id));
        if (first) setActive(first.id);
      },
      { root, rootMargin: "0px 0px -88% 0px" },
    );
    for (const el of sectionRefs.current.values()) observer.observe(el);
    return () => observer.disconnect();
  }, [sections, query]);

  const goToSection = (sectionId: string) => {
    const root = scrollRef.current;
    const el = sectionRefs.current.get(sectionId);
    if (!root || !el) return;
    setActive(sectionId);
    lockUntil.current = performance.now() + 700;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.scrollTo({ top: el.offsetTop, behavior: reduce ? "auto" : "smooth" });
  };

  const select = React.useCallback(
    (entry: EmojiEntry) => {
      const emoji = entry.tones ? withSkinTone(entry.emoji, skinTone) : entry.emoji;
      callbacks.current.onSelect?.(emoji, entry);
      recentStore.current = [entry.emoji, ...recentStore.current.filter((e) => e !== entry.emoji)].slice(0, maxRecent);
      try {
        window.localStorage.setItem(`${storageKey}:recent`, JSON.stringify(recentStore.current));
      } catch {}
    },
    [skinTone, maxRecent, storageKey],
  );

  const focusCell = (index: number) => {
    const next = Math.max(0, Math.min(cells.length - 1, index));
    setFocusIndex(next);
    const el = cellRefs.current[next];
    el?.focus({ preventScroll: true });
    el?.scrollIntoView({ block: "nearest" });
  };

  const onGridKeyDown = (event: React.KeyboardEvent) => {
    const current = cells[focusIndex];
    if (!current) return;
    const inRow = (row: number, col: number) => {
      let best = -1;
      cells.forEach((cell, i) => {
        if (cell.row === row && cell.col <= col) best = i;
      });
      return best;
    };
    let next = -1;
    if (event.key === "ArrowRight") next = focusIndex + 1;
    else if (event.key === "ArrowLeft") next = focusIndex - 1;
    else if (event.key === "ArrowDown") next = inRow(current.row + 1, current.col);
    else if (event.key === "ArrowUp") {
      if (current.row === 0) {
        event.preventDefault();
        searchRef.current?.focus();
        return;
      }
      next = inRow(current.row - 1, current.col);
    } else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = cells.length - 1;
    else return;
    event.preventDefault();
    if (next >= 0 && next < cells.length) focusCell(next);
  };

  const onSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusCell(0);
    } else if (event.key === "Enter") {
      const first = cells[0];
      if (first && query.trim()) {
        event.preventDefault();
        select(first.entry);
      }
    } else if (event.key === "Escape" && query) {
      event.preventDefault();
      setQuery("");
    }
  };

  const clampedFocus = Math.min(focusIndex, Math.max(0, cells.length - 1));
  const s = sizeStyles[size];
  const t = toneStyles[tone];
  const searching = query.trim().length > 0;
  const activeTab = searching ? -1 : Math.max(0, tabs.findIndex((tab) => tab.id === active));

  // Hover previews live in PreviewBar's own state, so hovering never re-renders these buttons
  let flat = 0;
  const grid = sections.map((section) => (
    <section
      key={section.id}
      data-section={section.id}
      aria-labelledby={`${id}-${section.id}`}
      ref={(el) => {
        if (el) sectionRefs.current.set(section.id, el);
        else sectionRefs.current.delete(section.id);
      }}
    >
      <h3 id={`${id}-${section.id}`} className={cn("sticky top-0 z-10 select-none px-1 py-1.5 text-sm font-medium text-muted-foreground", t.header)}>
        {section.label}
      </h3>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, var(--picker-cell))` }}>
        {section.items.map((entry) => {
          const index = flat++;
          const shown = entry.tones ? withSkinTone(entry.emoji, skinTone) : entry.emoji;
          return (
            <button
              key={`${section.id}-${entry.emoji}`}
              ref={(el) => {
                cellRefs.current[index] = el;
              }}
              type="button"
              tabIndex={index === clampedFocus ? 0 : -1}
              aria-label={entry.name}
              onClick={() => select(entry)}
              onPointerEnter={() => previewRef.current?.show(entry)}
              onFocus={() => {
                setFocusIndex(index);
                previewRef.current?.show(entry);
              }}
              className={cn(
                "grid cursor-pointer place-items-center rounded-lg leading-none outline-none",
                "motion-safe:transition-[background-color,scale] motion-safe:duration-200 hover:bg-foreground/8 active:scale-90",
                "focus-visible:bg-foreground/8 focus-visible:ring-2 focus-visible:ring-ring/50",
                s.cell,
                s.emoji,
              )}
              style={{ transitionTimingFunction: SPRING_EASE }}
            >
              {shown}
            </button>
          );
        })}
      </div>
    </section>
  ));

  return (
    <section
      aria-label={ariaLabel}
      data-slot="reaction-picker"
      className={cn("flex w-fit flex-col overflow-hidden rounded-2xl", s.root, t.panel, className)}
      style={{ "--picker-ease": SPRING_EASE } as React.CSSProperties}
    >
      <div className="relative flex items-center gap-2 p-2">
        <label className={cn("flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg px-2.5 focus-within:ring-2 focus-within:ring-ring/50", t.field)}>
          <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <span className="sr-only">{placeholder}</span>
          <input
            ref={searchRef}
            type="search"
            // biome-ignore lint/a11y/noAutofocus: opt-in, for pickers opened from a button
            autoFocus={autoFocus}
            value={query}
            placeholder={placeholder}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onSearchKeyDown}
            className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
          />
        </label>
        <button
          ref={toneButtonRef}
          type="button"
          aria-label={`Skin tone: ${TONE_NAMES[skinTone]}`}
          aria-expanded={toneOpen}
          onClick={() => setToneOpen((open) => !open)}
          className={cn("grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-lg leading-none outline-none hover:bg-foreground/8 focus-visible:ring-2 focus-visible:ring-ring/50", t.field)}
        >
          {withSkinTone("✋", skinTone)}
        </button>
        {toneOpen && (
          <div
            role="radiogroup"
            aria-label="Skin tone"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                setToneOpen(false);
                toneButtonRef.current?.focus();
              }
            }}
            className={cn(
              "absolute inset-2 z-20 flex items-center justify-between gap-1 rounded-lg px-1",
              "motion-safe:transition-[opacity,scale] motion-safe:duration-300 motion-safe:starting:scale-95 starting:opacity-0",
              t.field,
            )}
            style={{ transitionTimingFunction: SPRING_EASE }}
          >
            {([0, 1, 2, 3, 4, 5] as SkinTone[]).map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={option === skinTone}
                aria-label={TONE_NAMES[option]}
                // biome-ignore lint/a11y/noAutofocus: focus lands on the current tone when the row opens
                autoFocus={option === skinTone}
                onClick={() => {
                  setSkinTone(option);
                  setToneOpen(false);
                  toneButtonRef.current?.focus();
                }}
                className={cn(
                  "grid size-8 cursor-pointer place-items-center rounded-md text-lg leading-none outline-none hover:bg-foreground/8 focus-visible:ring-2 focus-visible:ring-ring/50",
                  option === skinTone && "bg-foreground/10",
                )}
              >
                {withSkinTone("✋", option)}
              </button>
            ))}
          </div>
        )}
      </div>

      <nav aria-label="Categories" className="relative grid px-2" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bottom-0 left-2 h-0.5 rounded-full bg-foreground motion-safe:transition-[translate,opacity] motion-safe:duration-500",
            activeTab < 0 && "opacity-0",
          )}
          style={{
            width: `calc((100% - 1rem) / ${tabs.length})`,
            translate: `${Math.max(0, activeTab) * 100}% 0`,
            transitionTimingFunction: SPRING_EASE,
          }}
        />
        {tabs.map((tab, i) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              title={tab.label}
              aria-label={tab.label}
              aria-current={i === activeTab ? "true" : undefined}
              onClick={() => {
                if (searching) setQuery("");
                requestAnimationFrame(() => goToSection(tab.id));
              }}
              className={cn(
                "grid h-9 cursor-pointer place-items-center rounded-md text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
                i === activeTab && "text-foreground",
              )}
            >
              <Icon aria-hidden="true" className="size-4.5" />
            </button>
          );
        })}
      </nav>

      {/* biome-ignore lint/a11y/noStaticElementInteractions: arrow keys move focus between the emoji buttons inside */}
      <div
        ref={scrollRef}
        onKeyDown={onGridKeyDown}
        onPointerLeave={() => previewRef.current?.show(null)}
        className={cn("relative overflow-y-auto overscroll-contain px-2 pb-2 [scrollbar-gutter:stable] [scrollbar-width:thin]", s.area)}
      >
        {cells.length === 0 ? (
          <p className="grid h-full select-none place-items-center px-6 text-center text-sm text-muted-foreground">No emoji for "{query.trim()}"</p>
        ) : (
          grid
        )}
      </div>

      <PreviewBar ref={previewRef} skinTone={skinTone} size={size} />
    </section>
  );
}
