"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import styles from "./MoniDemo.module.css";

export type MoniPose = "idle" | "hello" | "think" | "talk" | "happy" | "present";

const frames: Record<MoniPose, string> = {
  idle: "0% 0%",
  hello: "50% 0%",
  think: "100% 0%",
  talk: "0% 100%",
  happy: "50% 100%",
  present: "100% 100%"
};

export default function MoniCharacter({ pose = "idle", moving = true }: { pose?: MoniPose; moving?: boolean }) {
  const reducedMotion = useReducedMotion();
  const animated = moving && !reducedMotion;
  return (
    <motion.span
      className={styles.character}
      role="img"
      aria-label="Artmonianın narıncı fırça maskotu Moni"
      animate={animated ? { y: [0, -4, 0], rotate: pose === "hello" || pose === "happy" ? [-2, 2, -2] : [0, 1, 0] } : { y: 0, rotate: 0 }}
      transition={{ duration: pose === "hello" || pose === "happy" ? 1.8 : 3.4, repeat: animated ? Infinity : 0, ease: "easeInOut" }}
    >
      <span className={styles.sprite} style={{ "--moni-frame": frames[pose] } as CSSProperties} />
    </motion.span>
  );
}
