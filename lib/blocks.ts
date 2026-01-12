import { ComingSoon1, comingsoon1Demo } from "@/components/beste/comingsoon1";
import { ComingSoon2, comingsoon2Demo } from "@/components/beste/comingsoon2";
import { ComingSoon3, comingsoon3Demo } from "@/components/beste/comingsoon3";
import { ComingSoon4, comingsoon4Demo } from "@/components/beste/comingsoon4";
import { Crypto1, crypto1Demo } from "@/components/beste/crypto1";
import { Crypto24, crypto24Demo } from "@/components/beste/crypto24";
import { Crypto35, crypto35Demo } from "@/components/beste/crypto35";
import { Devtools3, devtools3Demo } from "@/components/beste/devtools3";
import { Ecommerce1, ecommerce1Demo } from "@/components/beste/ecommerce1";
import { Ecommerce11, ecommerce11Demo } from "@/components/beste/ecommerce11";
import { Ecommerce15, ecommerce15Demo } from "@/components/beste/ecommerce15";
import { Ecommerce4, ecommerce4Demo } from "@/components/beste/ecommerce4";
import { Ecommerce5, ecommerce5Demo } from "@/components/beste/ecommerce5";
import { Ecommerce6, ecommerce6Demo } from "@/components/beste/ecommerce6";
import { Feature126, feature126Demo } from "@/components/beste/feature126";
import { Feature144, feature144Demo } from "@/components/beste/feature144";
import { Feature146, feature146Demo } from "@/components/beste/feature146";
import { Feature152, feature152Demo } from "@/components/beste/feature152";
import { Feature22, feature22Demo } from "@/components/beste/feature22";
import { Feature23, feature23Demo } from "@/components/beste/feature23";
import { Feature24, feature24Demo } from "@/components/beste/feature24";
import { Feature26, feature26Demo } from "@/components/beste/feature26";
import { Feature28, feature28Demo } from "@/components/beste/feature28";
import { Feature29, feature29Demo } from "@/components/beste/feature29";
import { Feature30, feature30Demo } from "@/components/beste/feature30";
import { Feature34, feature34Demo } from "@/components/beste/feature34";
import { Health1, health1Demo } from "@/components/beste/health1";
import { Health16, health16Demo } from "@/components/beste/health16";
import { Health2, health2Demo } from "@/components/beste/health2";
import { Health3, health3Demo } from "@/components/beste/health3";
import { Health4, health4Demo } from "@/components/beste/health4";
import { Health5, health5Demo } from "@/components/beste/health5";
import { Health6, health6Demo } from "@/components/beste/health6";
import { Hero19, hero19Demo } from "@/components/beste/hero19";
import { Hero20, hero20Demo } from "@/components/beste/hero20";
import { Hero21, hero21Demo } from "@/components/beste/hero21";
import { Hero24, hero24Demo } from "@/components/beste/hero24";
import { Hero57, hero57Demo } from "@/components/beste/hero57";
import { Hero65, hero65Demo } from "@/components/beste/hero65";
import { Hero68, hero68Demo } from "@/components/beste/hero68";
import { Hero69, hero69Demo } from "@/components/beste/hero69";
// Available components
import { Hero7, hero7Demo } from "@/components/beste/hero7";
import { Onboarding1, onboarding1Demo } from "@/components/beste/onboarding1";
import { Onboarding3, onboarding3Demo } from "@/components/beste/onboarding3";
import { Onboarding4, onboarding4Demo } from "@/components/beste/onboarding4";
import { Onboarding9, onboarding9Demo } from "@/components/beste/onboarding9";
import { Reveal1, reveal1Demo } from "@/components/beste/reveal1";
import { Reveal2, reveal2Demo } from "@/components/beste/reveal2";
import { Settings64, settings64Demo } from "@/components/beste/settings64";
import { Showcase2, showcase2Demo } from "@/components/beste/showcase2";
import { Showcase3, showcase3Demo } from "@/components/beste/showcase3";
import { Terminal1, terminal1Demo } from "@/components/beste/terminal1";
import {
  Testimonial1,
  testimonial1Demo,
} from "@/components/beste/testimonial1";
import {
  Testimonial6,
  testimonial6Demo,
} from "@/components/beste/testimonial6";
import {
  Testimonial8,
  testimonial8Demo,
} from "@/components/beste/testimonial8";
import { UseCase10, usecase10Demo } from "@/components/beste/usecase10";
import { UseCase2, usecase2Demo } from "@/components/beste/usecase2";
import { UseCase3, usecase3Demo } from "@/components/beste/usecase3";
import { UseCase4, usecase4Demo } from "@/components/beste/usecase4";
import { UseCase5, usecase5Demo } from "@/components/beste/usecase5";
import { UseCase7, usecase7Demo } from "@/components/beste/usecase7";
import { UseCase8, usecase8Demo } from "@/components/beste/usecase8";
import { UseCase9, usecase9Demo } from "@/components/beste/usecase9";

import type { ComponentType } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface BlockMeta {
  name: string;
  title: string;
  description: string;
  category: string;
  component: ComponentType<any>;
  demoProps: any;
  fullscreen?: boolean;
  previewAlign?: "top" | "bottom";
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const _blocks: BlockMeta[] = [
  {
    name: "hero7",
    title: "Hero 7",
    description: "Centered hero section with badge, heading, buttons and media",
    category: "Hero",
    component: Hero7,
    demoProps: hero7Demo,
  },
  {
    name: "hero24",
    title: "Hero 24",
    description:
      "Split hero with social proof, floating cards and progress indicator",
    category: "Hero",
    component: Hero24,
    demoProps: hero24Demo,
  },
  {
    name: "feature126",
    title: "Feature 126",
    description: "Stats grid with large numbers",
    category: "Feature",
    component: Feature126,
    demoProps: feature126Demo,
  },
  {
    name: "feature144",
    title: "Feature 144",
    description: "Service offerings list with arrows",
    category: "Feature",
    component: Feature144,
    demoProps: feature144Demo,
  },
  {
    name: "feature146",
    title: "Feature 146",
    description: "Benefits list with checkmarks",
    category: "Feature",
    component: Feature146,
    demoProps: feature146Demo,
  },
  {
    name: "feature152",
    title: "Feature 152",
    description: "Icon badge pills row",
    category: "Feature",
    component: Feature152,
    demoProps: feature152Demo,
  },
  {
    name: "feature22",
    title: "Feature 22",
    description:
      "Progress checklist with steps, stats sidebar and completion tracking",
    category: "Feature",
    component: Feature22,
    demoProps: feature22Demo,
  },
  {
    name: "feature23",
    title: "Feature 23",
    description: "Quality score cards with progress bars and metrics",
    category: "Feature",
    component: Feature23,
    demoProps: feature23Demo,
  },
  {
    name: "feature24",
    title: "Feature 24",
    description: "Hover-to-preview workflow cards with list and preview layout",
    category: "Feature",
    component: Feature24,
    demoProps: feature24Demo,
  },
  {
    name: "feature26",
    title: "Feature 26",
    description: "Features grid with icon cards and hover effects",
    category: "Feature",
    component: Feature26,
    demoProps: feature26Demo,
  },
  {
    name: "feature28",
    title: "Feature 28",
    description: "Before/After comparison columns with highlighted differences",
    category: "Feature",
    component: Feature28,
    demoProps: feature28Demo,
  },
  {
    name: "feature29",
    title: "Feature 29",
    description: "Before/After comparison columns with highlighted differences",
    category: "Feature",
    component: Feature29,
    demoProps: feature29Demo,
  },
  {
    name: "feature30",
    title: "Feature 30",
    description: "Before/After comparison columns with highlighted differences",
    category: "Feature",
    component: Feature30,
    demoProps: feature30Demo,
  },
  {
    name: "feature34",
    title: "Feature 34",
    description: "Numbered feature list with two-column grid layout",
    category: "Feature",
    component: Feature34,
    demoProps: feature34Demo,
  },
  {
    name: "testimonial1",
    title: "Testimonial 1",
    description: "Swipeable carousel testimonials with autoplay",
    category: "Testimonial",
    component: Testimonial1,
    demoProps: testimonial1Demo,
  },
  {
    name: "testimonial6",
    title: "Testimonial 6",
    description: "Single centered quote with author info",
    category: "Testimonial",
    component: Testimonial6,
    demoProps: testimonial6Demo,
  },
  {
    name: "testimonial8",
    title: "Testimonial 8",
    description: "Quote-style testimonial cards with highlighted text",
    category: "Testimonial",
    component: Testimonial8,
    demoProps: testimonial8Demo,
  },
  {
    name: "hero65",
    title: "Hero 65",
    description: "Split hero with embedded YouTube video",
    category: "Hero",
    component: Hero65,
    demoProps: hero65Demo,
  },
  {
    name: "hero68",
    title: "Hero 68",
    description: "Hero with feature cards grid below",
    category: "Hero",
    component: Hero68,
    demoProps: hero68Demo,
  },
  {
    name: "hero69",
    title: "Hero 69",
    description: "Hero with email signup form",
    category: "Hero",
    component: Hero69,
    demoProps: hero69Demo,
  },
  {
    name: "hero57",
    title: "Hero 57",
    description: "Full-height hero with animated scroll indicator",
    category: "Hero",
    component: Hero57,
    demoProps: hero57Demo,
  },
  {
    name: "health1",
    title: "Health 1",
    description:
      "Health metrics dashboard with vitals, progress rings and trends",
    category: "Health",
    component: Health1,
    demoProps: health1Demo,
  },
  {
    name: "health2",
    title: "Health 2",
    description:
      "Wellness goals tracker with progress bars and completion badges",
    category: "Health",
    component: Health2,
    demoProps: health2Demo,
  },
  {
    name: "health3",
    title: "Health 3",
    description:
      "Medical specialists grid with ratings and appointment booking",
    category: "Health",
    component: Health3,
    demoProps: health3Demo,
  },
  {
    name: "health4",
    title: "Health 4",
    description: "Minimal zen hero with large typography and serene imagery",
    category: "Health",
    component: Health4,
    demoProps: health4Demo,
  },
  {
    name: "health5",
    title: "Health 5",
    description:
      "Healthcare services grid with icons, durations and feature lists",
    category: "Health",
    component: Health5,
    demoProps: health5Demo,
  },
  {
    name: "health6",
    title: "Health 6",
    description: "Editorial content section with rich text, highlights and CTA",
    category: "Health",
    component: Health6,
    demoProps: health6Demo,
  },
  {
    name: "health16",
    title: "Health 16",
    description:
      "Health statistics display with large numbers and dynamic grid",
    category: "Health",
    component: Health16,
    demoProps: health16Demo,
  },
  {
    name: "hero19",
    title: "Hero 19",
    description:
      "Cinematic fullscreen carousel with bottom content and next slide preview",
    category: "Hero",
    component: Hero19,
    demoProps: hero19Demo,
    fullscreen: true,
    previewAlign: "bottom",
  },
  {
    name: "hero20",
    title: "Hero 20",
    description:
      "Split layout carousel with thumbnails and vertical progress indicator",
    category: "Hero",
    component: Hero20,
    demoProps: hero20Demo,
    fullscreen: true,
  },
  {
    name: "hero21",
    title: "Hero 21",
    description:
      "Full-screen carousel hero with slides, navigation and progress bar",
    category: "Hero",
    component: Hero21,
    demoProps: hero21Demo,
    fullscreen: true,
  },
  {
    name: "reveal1",
    title: "Reveal 1",
    description: "Before/After image comparison slider with draggable divider",
    category: "Reveal",
    component: Reveal1,
    demoProps: reveal1Demo,
  },
  {
    name: "reveal2",
    title: "Reveal 2",
    description:
      "Before/After split layout with highlights and draggable slider",
    category: "Reveal",
    component: Reveal2,
    demoProps: reveal2Demo,
  },
  {
    name: "usecase2",
    title: "Use Case 2",
    description:
      "Grid-based use case cards with images, descriptions and feature lists",
    category: "Use Case",
    component: UseCase2,
    demoProps: usecase2Demo,
  },
  {
    name: "usecase3",
    title: "Use Case 3",
    description: "Numbered steps layout with alternating image positions",
    category: "Use Case",
    component: UseCase3,
    demoProps: usecase3Demo,
  },
  {
    name: "usecase4",
    title: "Use Case 4",
    description: "Grid cards with icons, images and feature tags",
    category: "Use Case",
    component: UseCase4,
    demoProps: usecase4Demo,
  },
  {
    name: "usecase5",
    title: "Use Case 5",
    description: "Icon grid with centered icons and descriptions",
    category: "Use Case",
    component: UseCase5,
    demoProps: usecase5Demo,
  },
  {
    name: "usecase7",
    title: "Use Case 7",
    description: "Accordion FAQ layout with expandable items and images",
    category: "Use Case",
    component: UseCase7,
    demoProps: usecase7Demo,
  },
  {
    name: "usecase8",
    title: "Use Case 8",
    description: "Timeline layout with alternating content and images",
    category: "Use Case",
    component: UseCase8,
    demoProps: usecase8Demo,
  },
  {
    name: "usecase9",
    title: "Use Case 9",
    description: "Masonry grid with variable card sizes and background images",
    category: "Use Case",
    component: UseCase9,
    demoProps: usecase9Demo,
  },
  {
    name: "usecase10",
    title: "Use Case 10",
    description: "Split layout with content and image side by side",
    category: "Use Case",
    component: UseCase10,
    demoProps: usecase10Demo,
  },
  {
    name: "showcase2",
    title: "Showcase 2",
    description: "Split layout showcase with hotspots and action buttons",
    category: "Showcase",
    component: Showcase2,
    demoProps: showcase2Demo,
  },
  {
    name: "showcase3",
    title: "Showcase 3",
    description: "Image gallery grid with captions",
    category: "Showcase",
    component: Showcase3,
    demoProps: showcase3Demo,
  },
  {
    name: "terminal1",
    title: "Terminal 1",
    description: "Terminal typewriter animation with commands and outputs",
    category: "Terminal",
    component: Terminal1,
    demoProps: terminal1Demo,
  },
  {
    name: "comingsoon1",
    title: "Coming Soon 1",
    description: "Coming soon page with countdown timer",
    category: "Coming Soon",
    component: ComingSoon1,
    demoProps: comingsoon1Demo,
  },
  {
    name: "comingsoon2",
    title: "Coming Soon 2",
    description: "Coming soon page with progress milestones",
    category: "Coming Soon",
    component: ComingSoon2,
    demoProps: comingsoon2Demo,
  },
  {
    name: "comingsoon3",
    title: "Coming Soon 3",
    description: "Coming soon page with social links",
    category: "Coming Soon",
    component: ComingSoon3,
    demoProps: comingsoon3Demo,
  },
  {
    name: "comingsoon4",
    title: "Coming Soon 4",
    description: "Coming soon page with floating animated icons",
    category: "Coming Soon",
    component: ComingSoon4,
    demoProps: comingsoon4Demo,
  },
  {
    name: "ecommerce1",
    title: "Ecommerce 1",
    description: "Product card grid with ratings, prices and add to cart",
    category: "Ecommerce",
    component: Ecommerce1,
    demoProps: ecommerce1Demo,
  },
  {
    name: "ecommerce4",
    title: "Ecommerce 4",
    description: "Product category cards with images and product counts",
    category: "Ecommerce",
    component: Ecommerce4,
    demoProps: ecommerce4Demo,
  },
  {
    name: "ecommerce5",
    title: "Ecommerce 5",
    description: "Featured product showcase with split layout and details",
    category: "Ecommerce",
    component: Ecommerce5,
    demoProps: ecommerce5Demo,
  },
  {
    name: "ecommerce6",
    title: "Ecommerce 6",
    description: "Product reviews list with ratings and helpful votes",
    category: "Ecommerce",
    component: Ecommerce6,
    demoProps: ecommerce6Demo,
  },
  {
    name: "crypto1",
    title: "Crypto 1",
    description: "Token hero with live price stats and market data",
    category: "Crypto",
    component: Crypto1,
    demoProps: crypto1Demo,
  },
  {
    name: "crypto24",
    title: "Crypto 24",
    description: "DAO governance proposals with vote bars and status badges",
    category: "Crypto",
    component: Crypto24,
    demoProps: crypto24Demo,
  },
  {
    name: "crypto35",
    title: "Crypto 35",
    description:
      "Smart contract addresses list with copy buttons and verification badges",
    category: "Crypto",
    component: Crypto35,
    demoProps: crypto35Demo,
  },
  {
    name: "onboarding1",
    title: "Onboarding 1",
    description: "Welcome hero screen with image, CTA and step indicator",
    category: "Onboarding",
    component: Onboarding1,
    demoProps: onboarding1Demo,
  },
  {
    name: "onboarding3",
    title: "Onboarding 3",
    description: "Minimal centered welcome with icon and single CTA",
    category: "Onboarding",
    component: Onboarding3,
    demoProps: onboarding3Demo,
  },
  {
    name: "onboarding4",
    title: "Onboarding 4",
    description: "Video intro onboarding with play button and skip option",
    category: "Onboarding",
    component: Onboarding4,
    demoProps: onboarding4Demo,
  },
  {
    name: "onboarding9",
    title: "Onboarding 9",
    description: "Step-by-step onboarding wizard with numbered indicators",
    category: "Onboarding",
    component: Onboarding9,
    demoProps: onboarding9Demo,
  },
  {
    name: "devtools3",
    title: "DevTools 3",
    description: "Code block with multi-language tabs and syntax highlighting",
    category: "DevTools",
    component: Devtools3,
    demoProps: devtools3Demo,
  },
  {
    name: "ecommerce11",
    title: "Ecommerce 11",
    description: "Size guide table with measurements for clothing products",
    category: "Ecommerce",
    component: Ecommerce11,
    demoProps: ecommerce11Demo,
  },
  {
    name: "ecommerce15",
    title: "Ecommerce 15",
    description: "Shipping and returns info cards with icons",
    category: "Ecommerce",
    component: Ecommerce15,
    demoProps: ecommerce15Demo,
  },
  {
    name: "settings64",
    title: "Settings 64",
    description:
      "Billing history table with status badges and download actions",
    category: "Settings",
    component: Settings64,
    demoProps: settings64Demo,
  },
];

export const blocks = _blocks;

export function getBlock(name: string): BlockMeta | undefined {
  return blocks.find((block) => block.name === name);
}
