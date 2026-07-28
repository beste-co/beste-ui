"use client";

import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AirplaneTakeOff01Icon,
  Analytics01Icon,
  Bitcoin01Icon,
  BookOpen01Icon,
  Briefcase01Icon,
  Building03Icon,
  Calendar03Icon,
  CalendarCheckIn01Icon,
  ChartUpIcon,
  Clock01Icon,
  CursorPointer01Icon,
  DocumentValidationIcon,
  DumbbellIcon,
  File01Icon,
  Folder01Icon,
  GridIcon,
  HeartCheckIcon,
  HelpCircleIcon,
  Idea01Icon,
  JusticeScale01Icon,
  LayoutBottomIcon,
  LayoutLeftIcon,
  Menu01Icon,
  Message01Icon,
  Mic01Icon,
  MortarboardIcon,
  News01Icon,
  QuoteDownIcon,
  RestaurantTableIcon,
  RocketIcon,
  SearchRemoveIcon,
  Settings01Icon,
  ShoppingCart01Icon,
  SourceCodeIcon,
  SparklesIcon,
  TerminalIcon,
  UserAdd01Icon,
  UserGroupIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";

/*
 * The category names the metas use, mapped to the glyph each one gets. The keys
 * are lucide's old names because that is what the category data still says; only
 * what they resolve to has changed.
 */
const iconMap: Record<string, IconSvgElement> = {
  LayoutGrid: GridIcon,
  UserPlus: UserAdd01Icon,
  Sparkles: SparklesIcon,
  Quote: QuoteDownIcon,
  HeartPulse: HeartCheckIcon,
  Rocket: RocketIcon,
  SplitSquareHorizontal: LayoutLeftIcon,
  Lightbulb: Idea01Icon,
  Eye: ViewIcon,
  SquareTerminal: TerminalIcon,
  Clock: Clock01Icon,
  ShoppingCart: ShoppingCart01Icon,
  HelpCircle: HelpCircleIcon,
  Bitcoin: Bitcoin01Icon,
  Code: SourceCodeIcon,
  Settings: Settings01Icon,
  Dumbbell: DumbbellIcon,
  GraduationCap: MortarboardIcon,
  Menu: Menu01Icon,
  PanelBottom: LayoutBottomIcon,
  Plane: AirplaneTakeOff01Icon,
  Users: UserGroupIcon,
  BarChart3: Analytics01Icon,
  UtensilsCrossed: RestaurantTableIcon,
  Briefcase: Briefcase01Icon,
  Mic: Mic01Icon,
  FolderKanban: Folder01Icon,
  FileText: File01Icon,
  Scale: JusticeScale01Icon,
  CalendarDays: Calendar03Icon,
  BookText: BookOpen01Icon,
  Newspaper: News01Icon,
  TrendingUp: ChartUpIcon,
  MousePointerClick: CursorPointer01Icon,
  MessageSquare: Message01Icon,
  Building2: Building03Icon,
  CalendarCheck: CalendarCheckIn01Icon,
  ScrollText: DocumentValidationIcon,
  SearchX: SearchRemoveIcon,
};

interface CategoryIconProps {
  name?: string;
  className?: string;
}

export function CategoryIcon({ name, className }: CategoryIconProps) {
  if (!name) return null;

  const icon = iconMap[name];
  if (!icon) return null;

  return <HugeiconsIcon icon={icon} strokeWidth={2} className={className} />;
}
