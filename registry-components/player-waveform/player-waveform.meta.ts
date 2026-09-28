import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "player-waveform",
  title: "Player Waveform",
  description:
    "An audio waveform you can seek through: loudness peaks drawn as rounded bars that rise in from the middle on load, the played part tinted in full, the part under the pointer previewed in a lighter tint with a time bubble above, and a thin playhead on hover. It resamples any number of peaks to the bars that fit the width, keeps its own clock with an optional play button so it plays on its own, or follows a real audio element. Drag, click and keys seek (arrows 5 seconds, Shift 1, Page keys a tenth, Home and End), Space or K plays and pauses, and a native range input carries it for assistive technology.",
  category: "Player",
  usage: `import { PlayerWaveform, resamplePeaks } from "@/components/beste/component/player-waveform";

// Plays on its own, with a button and times
<PlayerWaveform
  peaks={peaks}                 // numbers from 0 to 1, any length
  duration={214}
  defaultPlaying
  loop
  showPlay
  showTime
/>

// Follows an audio element: controlled value and playing state
<PlayerWaveform
  peaks={peaks}
  duration={audio.duration}
  value={currentTime}
  playing={isPlaying}
  onPlayingChange={(next) => console.log(next ? "play" : "pause")}
  onValueCommit={(seconds) => console.log("seek to", seconds)}
  barWidth={2}                  // px
  gap={1}                       // px
  tone="muted"                  // "muted" | "outline" | "ghost" (default)
  size="lg"                     // "sm" | "default" | "lg"
/>`,
};
