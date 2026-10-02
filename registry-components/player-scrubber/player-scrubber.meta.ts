import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "player-scrubber",
  title: "Player Scrubber",
  cardScale: 0.8,
  description:
    "A media timeline for audio and video with its own play button and clock, so it plays on its own or follows a real media element: chapters drawn as separate segments with small gaps that open and swell under the pointer, a buffered range, the played fill and a thumb that appears on hover and grows while dragging. A bubble above the track shows the time and the chapter under the pointer, elapsed and remaining times can sit on either side, and click and key jumps land on a soft spring while dragging follows the pointer exactly. Arrow keys seek 5 seconds (1 with Shift), Page keys a tenth, Home and End the ends, all on a native range input for full accessibility.",
  category: "Player",
  usage: `import { PlayerScrubber, formatTime } from "@/components/beste/component/player-scrubber";

// Uncontrolled, with chapters and a buffered range
<PlayerScrubber
  duration={242}
  defaultValue={71}
  buffered={150}                        // seconds loaded, or [[start, end], ...]
  chapters={[
    { start: 0, title: "Intro" },
    { start: 38, title: "Says" },
    { start: 121, title: "Hammers" },
  ]}
  showTime                              // elapsed on the left, remaining on the right
/>

// Controlled by a media element: follow playback, seek on release
<PlayerScrubber
  duration={audio.duration}
  value={currentTime}
  onValueCommit={(seconds) => console.log("seek to", seconds)}
  tone="outline"                        // "muted" (default) | "outline" | "ghost"
  size="lg"                             // "sm" | "default" | "lg"
/>

formatTime(3725); // "1:02:05"`,
};
