import type { Theme, ThemeName } from "@/lib/themes/types";

import { aliceLuxuryDarkTheme } from "./alice-luxury-dark";
import { aliceLuxuryTheme } from "./alice-luxury";
import { amethystHazeTheme } from "./amethyst-haze";
import { awesomeChildDarkTheme } from "./awesome-child-dark";
import { awesomeChildTheme } from "./awesome-child";
import { bubblegumDarkTheme } from "./bubblegum-dark";
import { bubblegumTheme } from "./bubblegum";
import { cadenzaDarkTheme } from "./cadenza-dark";
import { cadenzaTheme } from "./cadenza";
import { caravanDayDarkTheme } from "./caravan-day-dark";
import { caravanDayTheme } from "./caravan-day";
import { catppuccinDarkTheme } from "./catppuccin-dark";
import { catppuccinTheme } from "./catppuccin";
import { claudePlusDarkTheme } from "./claude-plus-dark";
import { claudePlusTheme } from "./claude-plus";
import { claymorphismTheme } from "./claymorphism";
import { cyberpunkTheme } from "./cyberpunk";
import { darkCandyTheme } from "./dark-candy";
import { defaultDarkTheme } from "./default-dark";
import { defaultTheme } from "./default";
import { enterpriseBlueDarkTheme } from "./enterprise-blue-dark";
import { enterpriseBlueTheme } from "./enterprise-blue";
import { ghibliTrapDarkTheme } from "./ghibli-trap-dark";
import { ghibliTrapTheme } from "./ghibli-trap";
import { irisTheme } from "./iris";
import { lDarkTheme } from "./l-dark";
import { lTheme } from "./l";
import { limeGreenDarkTheme } from "./lime-green-dark";
import { limeGreenTheme } from "./lime-green";
import { lightGreenDarkTheme } from "./light-green-dark";
import { lightGreenTheme } from "./light-green";
import { midnightBloomTheme } from "./midnight-bloom";
import { minimalNeutralDarkTheme } from "./minimal-neutral-dark";
import { minimalNeutralTheme } from "./minimal-neutral";
import { monoTheme } from "./mono";
import { muskTheme } from "./musk";
import { papirusTheme } from "./papirus";
import { partyRockDarkTheme } from "./party-rock-dark";
import { partyRockTheme } from "./party-rock";
import { perpetuityDarkTheme } from "./perpetuity-dark";
import { perpetuityTheme } from "./perpetuity";
import { realmorphismDarkTheme } from "./realmorphism-dark";
import { realmorphismTheme } from "./realmorphism";
import { sageGardenDarkTheme } from "./sage-garden-dark";
import { sageGardenTheme } from "./sage-garden";
import { stellaDarkTheme } from "./stella-dark";
import { stellaTheme } from "./stella";
import { styreneDarkTheme } from "./styrene-dark";
import { styreneTheme } from "./styrene";
import { supabaseTheme } from "./supabase";
import { terminalTheme } from "./terminal";
import { theme10Theme } from "./theme10";
import { theme11Theme } from "./theme11";
import { theme12Theme } from "./theme12";
import { theme13Theme } from "./theme13";
import { theme14Theme } from "./theme14";
import { theme15Theme } from "./theme15";
import { theme16Theme } from "./theme16";
import { theme17Theme } from "./theme17";
import { theme18Theme } from "./theme18";
import { theme19Theme } from "./theme19";
import { theme1Theme } from "./theme1";
import { theme20Theme } from "./theme20";
import { theme21Theme } from "./theme21";
import { theme22Theme } from "./theme22";
import { theme23Theme } from "./theme23";
import { theme24Theme } from "./theme24";
import { theme25Theme } from "./theme25";
import { theme26Theme } from "./theme26";
import { theme27Theme } from "./theme27";
import { theme28Theme } from "./theme28";
import { theme29Theme } from "./theme29";
import { theme2Theme } from "./theme2";
import { theme30Theme } from "./theme30";
import { theme31Theme } from "./theme31";
import { theme32Theme } from "./theme32";
import { theme3Theme } from "./theme3";
import { theme4Theme } from "./theme4";
import { theme5Theme } from "./theme5";
import { theme6Theme } from "./theme6";
import { theme7Theme } from "./theme7";
import { theme8Theme } from "./theme8";
import { theme9Theme } from "./theme9";
import { tiesenDarkTheme } from "./tiesen-dark";
import { tiesenTheme } from "./tiesen";
import { twitterDarkTheme } from "./twitter-dark";
import { twitterTheme } from "./twitter";
import { vetiverTheme } from "./vetiver";
import { vintagePaperDarkTheme } from "./vintage-paper-dark";
import { vintagePaperTheme } from "./vintage-paper";
import { violetBloomTheme } from "./violet-bloom";
import { violetDarkTheme } from "./violet-dark";
import { violetTheme } from "./violet";
import { zenInspiredDarkTheme } from "./zen-inspired-dark";
import { zenInspiredTheme } from "./zen-inspired";

export const themes: Record<ThemeName, Theme> = {
  default: defaultTheme,
  "default-dark": defaultDarkTheme,
  "alice-luxury": aliceLuxuryTheme,
  "alice-luxury-dark": aliceLuxuryDarkTheme,
  "caravan-day": caravanDayTheme,
  "caravan-day-dark": caravanDayDarkTheme,
  catppuccin: catppuccinTheme,
  "catppuccin-dark": catppuccinDarkTheme,
  twitter: twitterTheme,
  "twitter-dark": twitterDarkTheme,
  "ghibli-trap": ghibliTrapTheme,
  "ghibli-trap-dark": ghibliTrapDarkTheme,
  "light-green": lightGreenTheme,
  "light-green-dark": lightGreenDarkTheme,
  "minimal-neutral": minimalNeutralTheme,
  "minimal-neutral-dark": minimalNeutralDarkTheme,
  "party-rock": partyRockTheme,
  "party-rock-dark": partyRockDarkTheme,
  perpetuity: perpetuityTheme,
  "perpetuity-dark": perpetuityDarkTheme,
  "sage-garden": sageGardenTheme,
  "sage-garden-dark": sageGardenDarkTheme,
  stella: stellaTheme,
  "stella-dark": stellaDarkTheme,
  styrene: styreneTheme,
  "styrene-dark": styreneDarkTheme,
  terminal: terminalTheme,
  tiesen: tiesenTheme,
  "tiesen-dark": tiesenDarkTheme,
  "vintage-paper": vintagePaperTheme,
  "vintage-paper-dark": vintagePaperDarkTheme,
  violet: violetTheme,
  "violet-dark": violetDarkTheme,
  vetiver: vetiverTheme,
  theme32: theme32Theme,
  musk: muskTheme,
  l: lTheme,
  "l-dark": lDarkTheme,
  cyberpunk: cyberpunkTheme,
  "midnight-bloom": midnightBloomTheme,
  "violet-bloom": violetBloomTheme,
  iris: irisTheme,
  papirus: papirusTheme,
  theme31: theme31Theme,
  mono: monoTheme,
  "dark-candy": darkCandyTheme,
  "amethyst-haze": amethystHazeTheme,
  claymorphism: claymorphismTheme,
  supabase: supabaseTheme,
  theme1: theme1Theme,
  theme2: theme2Theme,
  theme3: theme3Theme,
  theme4: theme4Theme,
  theme5: theme5Theme,
  theme6: theme6Theme,
  theme7: theme7Theme,
  theme8: theme8Theme,
  theme9: theme9Theme,
  theme10: theme10Theme,
  theme11: theme11Theme,
  theme12: theme12Theme,
  theme13: theme13Theme,
  theme14: theme14Theme,
  theme15: theme15Theme,
  theme16: theme16Theme,
  theme17: theme17Theme,
  theme18: theme18Theme,
  theme19: theme19Theme,
  theme20: theme20Theme,
  theme21: theme21Theme,
  theme22: theme22Theme,
  theme23: theme23Theme,
  theme24: theme24Theme,
  theme25: theme25Theme,
  theme26: theme26Theme,
  theme27: theme27Theme,
  theme28: theme28Theme,
  theme29: theme29Theme,
  theme30: theme30Theme,
  bubblegum: bubblegumTheme,
  "bubblegum-dark": bubblegumDarkTheme,
  cadenza: cadenzaTheme,
  "cadenza-dark": cadenzaDarkTheme,
  "enterprise-blue": enterpriseBlueTheme,
  "enterprise-blue-dark": enterpriseBlueDarkTheme,
  "awesome-child": awesomeChildTheme,
  "awesome-child-dark": awesomeChildDarkTheme,
  realmorphism: realmorphismTheme,
  "realmorphism-dark": realmorphismDarkTheme,
  "zen-inspired": zenInspiredTheme,
  "zen-inspired-dark": zenInspiredDarkTheme,
  "lime-green": limeGreenTheme,
  "lime-green-dark": limeGreenDarkTheme,
  "claude-plus": claudePlusTheme,
  "claude-plus-dark": claudePlusDarkTheme,
};

// Export individual themes for direct access
export {
  aliceLuxuryTheme,
  aliceLuxuryDarkTheme,
  amethystHazeTheme,
  bubblegumTheme,
  bubblegumDarkTheme,
  cadenzaTheme,
  cadenzaDarkTheme,
  caravanDayTheme,
  caravanDayDarkTheme,
  catppuccinTheme,
  catppuccinDarkTheme,
  twitterTheme,
  twitterDarkTheme,
  ghibliTrapTheme,
  ghibliTrapDarkTheme,
  lTheme,
  lDarkTheme,
  lightGreenTheme,
  lightGreenDarkTheme,
  minimalNeutralTheme,
  minimalNeutralDarkTheme,
  partyRockTheme,
  partyRockDarkTheme,
  stellaTheme,
  stellaDarkTheme,
  styreneTheme,
  styreneDarkTheme,
  terminalTheme,
  tiesenTheme,
  tiesenDarkTheme,
  theme31Theme,
  claymorphismTheme,
  cyberpunkTheme,
  darkCandyTheme,
  defaultDarkTheme,
  defaultTheme,
  irisTheme,
  midnightBloomTheme,
  monoTheme,
  muskTheme,
  papirusTheme,
  theme32Theme,
  supabaseTheme,
  theme1Theme,
  theme2Theme,
  theme3Theme,
  theme4Theme,
  theme5Theme,
  theme6Theme,
  theme7Theme,
  theme8Theme,
  theme9Theme,
  theme10Theme,
  theme11Theme,
  theme12Theme,
  theme13Theme,
  theme14Theme,
  theme15Theme,
  theme16Theme,
  theme17Theme,
  theme18Theme,
  theme19Theme,
  theme20Theme,
  theme21Theme,
  theme22Theme,
  theme23Theme,
  theme24Theme,
  theme25Theme,
  theme26Theme,
  theme27Theme,
  theme28Theme,
  theme29Theme,
  theme30Theme,
  vetiverTheme,
  perpetuityTheme,
  perpetuityDarkTheme,
  sageGardenTheme,
  sageGardenDarkTheme,
  vintagePaperTheme,
  vintagePaperDarkTheme,
  violetTheme,
  violetDarkTheme,
  violetBloomTheme,
  enterpriseBlueTheme,
  enterpriseBlueDarkTheme,
  awesomeChildTheme,
  awesomeChildDarkTheme,
  realmorphismTheme,
  realmorphismDarkTheme,
  zenInspiredTheme,
  zenInspiredDarkTheme,
  limeGreenTheme,
  limeGreenDarkTheme,
  claudePlusTheme,
  claudePlusDarkTheme,
};
