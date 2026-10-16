"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Palitan ito kung kailangan i-match sa motion spec ng system niyo
const REVEAL = {
  duration: 0.65,
  distance: 24,
  ease: [0.22, 1, 0.36, 1] as const,
  amount: 0.2,
  once: true, // true = isang beses lang mag-animate; false = tuwing nag-scroll
};

type Direction = "up" | "down" | "left" | "right" | "none";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  fitContent?: boolean;
  direction?: Direction;
  once?: boolean;
};

const offsets = (d: number): Record<Direction, { x: number; y: number }> => ({
  up: { x: 0, y: d },
  down: { x: 0, y: -d },
  left: { x: d, y: 0 },
  right: { x: -d, y: 0 },
  none: { x: 0, y: 0 },
});

export default function Reveal({
  children,
  delay = 0,
  className,
  fitContent = false,
  direction = "up",
  once = REVEAL.once,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const { x, y } = reduceMotion
    ? { x: 0, y: 0 }
    : offsets(REVEAL.distance)[direction];

  return (
    <motion.div
      className={className}
      style={fitContent ? { width: "fit-content" } : undefined}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: REVEAL.amount }}
      transition={{
        duration: reduceMotion ? 0.2 : REVEAL.duration,
        delay: reduceMotion ? 0 : delay,
        ease: REVEAL.ease,
      }}
    >
      {children}
    </motion.div>
  );
}