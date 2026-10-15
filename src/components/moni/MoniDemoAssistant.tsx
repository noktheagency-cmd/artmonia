"use client";

import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MoniProgram } from "@/lib/moni-demo";
import MoniCharacter from "./MoniCharacter";
import MoniConversation from "./MoniConversation";
import styles from "./MoniDemo.module.css";

export default function MoniDemoAssistant({ catalog }: { catalog: MoniProgram[] }) {
  const reducedMotion = useReducedMotion();
  const [arrived, setArrived] = useState(false);
  const [landed, setLanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const [greeting, setGreeting] = useState(0);
  const [entryDistance, setEntryDistance] = useState(900);
  const [pageActive, setPageActive] = useState(true);
  const mascotButton = useRef<HTMLButtonElement>(null);
  const closeConversation = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const hero = document.getElementById("home-hero-title")?.closest("section");
    let frame = 0;
    let triggered = false;
    const check = () => {
      frame = 0;
      if (triggered) return;
      const passedHero = hero ? hero.getBoundingClientRect().bottom <= window.innerHeight * .28 : window.scrollY > window.innerHeight * .6;
      if (passedHero) {
        triggered = true;
        setEntryDistance(window.innerHeight + 200);
        setArrived(true);
        window.removeEventListener("scroll", requestCheck);
        window.removeEventListener("resize", requestCheck);
      }
    };
    const requestCheck = () => { if (!frame) frame = window.requestAnimationFrame(check); };
    requestCheck();
    window.addEventListener("scroll", requestCheck, { passive: true });
    window.addEventListener("resize", requestCheck);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestCheck);
      window.removeEventListener("resize", requestCheck);
    };
  }, []);

  useEffect(() => {
    const update = () => setPageActive(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    if (!landed || open || !pageActive || greeting > 0) return;
    const timer = window.setTimeout(() => setGreeting(1), 3300);
    return () => window.clearTimeout(timer);
  }, [landed, open, pageActive, greeting]);

  useEffect(() => {
    if (!open && started) {
      const frame = window.requestAnimationFrame(() => mascotButton.current?.focus({ preventScroll: true }));
      return () => window.cancelAnimationFrame(frame);
    }
  }, [open, started]);

  function begin() {
    setLanded(true);
    setCondensed(false);
    setStarted(true);
    setOpen(true);
  }

  const phrase = started ? "İstəsən, davam edək." : greeting === 0 ? "Salam! Mən Moniyəm." : "Sənə uyğun rəsm yolunu tapaq?";

  return (
    <MotionConfig reducedMotion="user">
      <div className={styles.dock} data-moni-demo="true">
        <AnimatePresence>
          {arrived && !open ? (
            <motion.div
              key="moni-entrance"
              className={condensed ? `${styles.arrival} ${styles.condensed}` : styles.arrival}
              initial={landed ? { opacity: 0, y: 8 } : reducedMotion ? { opacity: 0 } : { opacity: 0, y: -entryDistance, rotate: -12 }}
              animate={landed || reducedMotion ? { opacity: 1, y: 0, rotate: 0 } : { opacity: [0, 1, 1, 1, 1], y: [-entryDistance, -100, 12, -6, 0], rotate: [-12, 4, -3, 1, 0] }}
              exit={{ opacity: 0, y: 0, transition: { duration: .1 } }}
              transition={landed || reducedMotion ? { duration: .12 } : { duration: 1.15, times: [0, .56, .78, .9, 1], ease: "easeOut" }}
              onAnimationComplete={() => setLanded(true)}
            >
              {landed && !condensed ? (
                <motion.div className={styles.speech} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2 }}>
                  <button type="button" className={styles.speechText} onClick={begin} aria-label={`${phrase} Moni söhbətini aç`}>
                    <AnimatePresence mode="wait" initial={false}><motion.span key={phrase} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .12 }}>{phrase}</motion.span></AnimatePresence>
                    <ChevronRight aria-hidden="true" />
                  </button>
                  <button type="button" className={styles.dismissSpeech} aria-label="Moninin mesajını kiçilt" onClick={() => setCondensed(true)}><X aria-hidden="true" /></button>
                </motion.div>
              ) : null}
              <button ref={mascotButton} type="button" className={styles.mascotButton} onClick={begin} aria-label={started ? "Moni ilə söhbətə davam et" : "Moni ilə sənət yolunu tap"} aria-expanded={open}>
                <MoniCharacter pose={condensed || greeting > 0 || started ? "idle" : "hello"} moving={pageActive} />
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
        {started ? <MoniConversation active={open} pageActive={pageActive} catalog={catalog} onClose={closeConversation} /> : null}
      </div>
    </MotionConfig>
  );
}
