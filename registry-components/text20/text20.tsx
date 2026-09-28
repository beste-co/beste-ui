"use client";

import { motion, useReducedMotion, useSpring } from "framer-motion";
import { type ElementType, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

interface Text20Props {
  /** The text to set; each letter becomes its own spring */
  text: string;
  /** Element the text renders as */
  as?: Tag;
  /** How far letters are pushed from the cursor, 0 to 1 */
  force?: number;
  /** Radius around the cursor that moves letters, in pixels */
  reach?: number;
  /** How much a pushed letter leans away, 0 to 1 */
  tilt?: number;
  /** How much a pushed letter stretches upward, 0 to 1 */
  stretch?: number;
  /** Springiness of the return, 0 (settled) to 1 (lively wobble) */
  bounce?: number;
  /** Letters drop in one by one on mount */
  entrance?: boolean;
  /** Seconds before the first letter drops in */
  delay?: number;
  /** Seconds between letters as they drop in */
  stagger?: number;
  className?: string;
}

export const text20Demo: Text20Props = {
  text: "Loud type, strict grid.",
  as: "h2",
  className: "text-7xl font-semibold leading-[0.85] tracking-[-0.06em] md:text-8xl",
};

type Push = (dx: number, dy: number, turn: number, lift: number) => void;

interface Letter {
  push: Push;
  cx: number;
  cy: number;
  el: HTMLSpanElement | null;
}

function Glyph({
  char,
  index,
  register,
  stiffness,
  damping,
  entrance,
  delay,
  stagger,
}: {
  char: string;
  index: number;
  register: (index: number, letter: Omit<Letter, "cx" | "cy">) => void;
  stiffness: number;
  damping: number;
  entrance: boolean;
  delay: number;
  stagger: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const spring = { stiffness, damping, mass: 0.6 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  const rotate = useSpring(0, spring);
  const scaleY = useSpring(1, spring);

  useEffect(() => {
    register(index, {
      el: ref.current,
      push: (dx, dy, turn, lift) => {
        x.set(dx);
        y.set(dy);
        rotate.set(turn);
        scaleY.set(1 + lift);
      },
    });
  }, [index, register, x, y, rotate, scaleY]);

  return (
    <motion.span
      initial={entrance ? { opacity: 0, y: "60%", rotate: 12 } : false}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: delay + index * stagger }}
      className="inline-block"
    >
      <motion.span ref={ref} style={{ x, y, rotate, scaleY }} className="inline-block origin-bottom will-change-transform">
        {char}
      </motion.span>
    </motion.span>
  );
}

export function Text20({
  text,
  as = "p",
  force = 0.5,
  reach = 240,
  tilt = 0.5,
  stretch = 0.5,
  bounce = 0.5,
  entrance = true,
  delay = 0.15,
  stagger = 0.035,
  className,
}: Text20Props) {
  const reduce = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLElement>(null);
  const letters = useRef<Letter[]>([]);
  const settings = useRef({ force, reach, tilt, stretch });
  settings.current = { force, reach, tilt, stretch };
  const Tag = as as ElementType;

  const register = useCallback((index: number, letter: Omit<Letter, "cx" | "cy">) => {
    letters.current[index] = { ...letter, cx: 0, cy: 0 };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduce) return;
    let active = false;

    // Resting centers relative to the root; transforms never change offsets, so this stays true while letters move
    const measure = () => {
      for (const letter of letters.current) {
        const el = letter?.el;
        if (!letter || !el) continue;
        let cx = el.offsetWidth / 2;
        let cy = el.offsetHeight / 2;
        let node: HTMLElement | null = el;
        while (node && node !== root) {
          cx += node.offsetLeft;
          cy += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        letter.cx = cx;
        letter.cy = cy;
      }
    };

    const release = () => {
      if (!active) return;
      active = false;
      for (const letter of letters.current) letter?.push(0, 0, 0, 0);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const s = settings.current;
      const rect = root.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      if (px < -s.reach || py < -s.reach || px > rect.width + s.reach || py > rect.height + s.reach) return release();
      active = true;
      const strength = Math.max(0, Math.min(1, s.force)) * 220;
      const lean = Math.max(0, Math.min(1, s.tilt)) * 44;
      const lift = Math.max(0, Math.min(1, s.stretch)) * 0.6;
      for (const letter of letters.current) {
        if (!letter) continue;
        const dx = letter.cx - px;
        const dy = letter.cy - py;
        const dist = Math.hypot(dx, dy) || 1;
        const f = Math.max(0, 1 - dist / s.reach);
        const push = f * f * strength;
        letter.push((dx / dist) * push, (dy / dist) * push, (dx / dist) * f * lean, f * lift);
      }
    };

    const ro = new ResizeObserver(measure);
    ro.observe(root);
    document.fonts?.ready.then(measure);
    measure();
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", release);
    window.addEventListener("blur", release);

    return () => {
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", release);
      window.removeEventListener("blur", release);
    };
  }, [reduce, text]);

  const stiffness = 260 - Math.max(0, Math.min(1, bounce)) * 180;
  const damping = 26 - Math.max(0, Math.min(1, bounce)) * 20;
  let index = 0;
  const words = text.split(" ");

  return (
    <Tag ref={rootRef} aria-label={text} className={cn("relative cursor-default select-none", className)}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} aria-hidden="true">
          {wordIndex > 0 && " "}
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, charIndex) => (
              <Glyph
                key={charIndex}
                char={char}
                index={index++}
                register={register}
                stiffness={stiffness}
                damping={damping}
                entrance={entrance && !reduce}
                delay={delay}
                stagger={stagger}
              />
            ))}
          </span>
        </span>
      ))}
    </Tag>
  );
}
