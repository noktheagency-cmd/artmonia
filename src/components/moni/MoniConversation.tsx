"use client";

/* Catalog images retain their original crop inside this small preview. */
/* eslint-disable @next/next/no-img-element */

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, ChevronRight, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  emptyMoniSelection,
  getMoniRecommendation,
  moniFocuses,
  moniGoals,
  moniLevels,
  validateMoniDemoContact,
  type MoniFocus,
  type MoniGoal,
  type MoniLevel,
  type MoniProgram,
  type MoniSelection
} from "@/lib/moni-demo";
import MoniCharacter, { type MoniPose } from "./MoniCharacter";
import styles from "./MoniDemo.module.css";

type Phase = "goal" | "level" | "focus" | "thinking" | "plan" | "offer" | "contact" | "complete";

const phaseTitles: Record<Phase, string> = {
  goal: "Rəsmlə nə etmək istəyirsən?",
  level: "Bəs indi haradasan?",
  focus: "Hansı istiqamət səni çəkir?",
  thinking: "Sənət yolunu çəkirəm…",
  plan: "Bu yol sənin üçün.",
  offer: "Bu proqramla başlaya bilərsən.",
  contact: "İlk addımı birlikdə ataq?",
  complete: "İlk addımın hazırdır!"
};

const phasePoses: Record<Phase, MoniPose> = {
  goal: "talk", level: "hello", focus: "talk", thinking: "think", plan: "present", offer: "present", contact: "idle", complete: "happy"
};

const progress: Record<Phase, number> = { goal: 1, level: 1, focus: 1, thinking: 2, plan: 2, offer: 3, contact: 3, complete: 3 };

function AnswerChoices<T extends string>({ items, selected, onChoose }: {
  items: { id: T; label: string }[];
  selected: T | null;
  onChoose: (id: T) => void;
}) {
  return (
    <div className={styles.answers} role="group" aria-label="Moniyə cavabın">
      {items.map((item) => (
        <button key={item.id} type="button" aria-pressed={selected === item.id} onClick={() => onChoose(item.id)}>
          <span>{item.label}</span><ChevronRight aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

function PaintedPath({ steps }: { steps: { title: string; detail: string }[] }) {
  const reducedMotion = useReducedMotion();
  return (
    <div className={styles.path}>
      <svg viewBox="0 0 36 192" preserveAspectRatio="none" aria-hidden="true">
        <motion.path d="M18 10 C-2 35 38 45 18 70 S-3 112 18 130 S36 164 18 181" initial={{ pathLength: reducedMotion ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: reducedMotion ? 0 : 1.1, ease: "easeInOut" }} />
      </svg>
      <ol>
        {steps.map((step, index) => (
          <motion.li key={step.title} initial={reducedMotion ? false : { opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reducedMotion ? 0 : index * .24 + .12 }}>
            <span className={styles.pathDot} aria-hidden="true" /><strong>{step.title}</strong><p>{step.detail}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export default function MoniConversation({ active, pageActive, catalog, onClose }: {
  active: boolean;
  pageActive: boolean;
  catalog: MoniProgram[];
  onClose: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("goal");
  const [selection, setSelection] = useState<MoniSelection>({ ...emptyMoniSelection });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const recommendation = getMoniRecommendation(selection, catalog);

  useEffect(() => {
    if (!active || !pageActive || phase !== "thinking") return;
    const timer = window.setTimeout(() => setPhase("plan"), reducedMotion ? 100 : 1150);
    return () => window.clearTimeout(timer);
  }, [active, pageActive, phase, reducedMotion]);

  useEffect(() => {
    if (!active) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [active, onClose]);

  function restart() {
    setSelection({ ...emptyMoniSelection });
    setName("");
    setPhone("");
    setFormError("");
    setPhase("goal");
  }

  function chooseGoal(goal: MoniGoal) {
    setSelection({ goal, level: null, focus: null });
    setPhase("level");
  }

  function chooseLevel(level: MoniLevel) {
    setSelection((current) => ({ ...current, level, focus: null }));
    setPhase(selection.goal === "grow" ? "focus" : "thinking");
  }

  function chooseFocus(focus: MoniFocus) {
    setSelection((current) => ({ ...current, focus }));
    setPhase("thinking");
  }

  function goBack() {
    const previous: Partial<Record<Phase, Phase>> = {
      level: "goal", focus: "level", thinking: selection.goal === "grow" ? "focus" : "level",
      plan: selection.goal === "grow" ? "focus" : "level", offer: "plan", contact: "offer"
    };
    const next = previous[phase];
    if (next) setPhase(next);
    else onClose();
  }

  function completeDemo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validateMoniDemoContact(name, phone);
    if (error) { setFormError(error); return; }
    setFormError("");
    setPhase("complete");
  }

  return (
    <AnimatePresence>
      {active ? (
        <motion.section
          className={styles.conversation}
          data-page-active={pageActive}
          aria-label="Moni ilə sənət yolun — interaktiv demo"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: .97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: reducedMotion ? 0 : 10, scale: reducedMotion ? 1 : .98 }}
          transition={{ duration: reducedMotion ? .1 : .24, ease: "easeOut" }}
        >
          <div className={styles.mascotColumn} aria-hidden="true">
            <MoniCharacter pose={phasePoses[phase]} moving={pageActive} />
          </div>
          <div className={styles.chatColumn}>
            <header className={styles.chatHeader}>
              <div className={styles.identity}><span className={styles.nameDot} /><strong>Moni</strong><span className={styles.demoLabel}>Demo</span></div>
              <div className={styles.tools}>
                <button type="button" onClick={restart} aria-label="Moni söhbətini yenidən başlat" title="Yenidən başla"><RotateCcw aria-hidden="true" /></button>
                <button type="button" onClick={onClose} aria-label="Moni söhbətini bağla" title="Bağla"><X aria-hidden="true" /></button>
              </div>
            </header>
            <div className={styles.chatViewport}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={phase}
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
                  transition={{ duration: reducedMotion ? .06 : .15 }}
                  onAnimationComplete={() => { if (active && phase !== "thinking") headingRef.current?.focus({ preventScroll: true }); }}
                  className={styles.phase}
                >
                  <h2 ref={headingRef} tabIndex={-1}>{phaseTitles[phase]}</h2>

                  {phase === "goal" ? <><p className={styles.message}>Sənə uyğun başlanğıcı birlikdə tapaq.</p><AnswerChoices items={moniGoals} selected={selection.goal} onChoose={chooseGoal} /></> : null}
                  {phase === "level" ? <><p className={styles.message}>Hər başlanğıcın öz yolu var.</p><AnswerChoices items={moniLevels} selected={selection.level} onChoose={chooseLevel} /></> : null}
                  {phase === "focus" ? <><p className={styles.message}>Birini seç, yolu ona uyğun çəkim.</p><AnswerChoices items={moniFocuses} selected={selection.focus} onChoose={chooseFocus} /></> : null}
                  {phase === "thinking" ? <div className={styles.thinking} role="status"><span /><span /><span /><p>Seçimlərini birləşdirirəm.</p></div> : null}
                  {phase === "plan" && recommendation ? <>
                    <p className={styles.message}>Kiçik addımlarla başlayaq.</p>
                    <PaintedPath steps={recommendation.steps} />
                    <button type="button" className={styles.primary} onClick={() => setPhase("offer")}>Uyğun proqramı göstər <ArrowRight aria-hidden="true" /></button>
                  </> : null}
                  {phase === "offer" && recommendation ? <>
                    <p className={styles.message}>{recommendation.reason}</p>
                    {recommendation.program ? <article className={styles.program}>
                      {recommendation.program.image ? <img src={recommendation.program.image} alt={`${recommendation.program.title} proqramının vizual nümunəsi`} width={58} height={66} loading="lazy" decoding="async" /> : null}
                      <div><h3>{recommendation.program.title}</h3><p>{recommendation.program.duration || "Müddəti konsultasiyada dəqiqləşdirək"}</p><span>{recommendation.program.price || "Qiyməti konsultasiyada dəqiqləşdirək"}</span></div>
                    </article> : <p className={styles.availability}>Uyğun proqramı mentorla birlikdə dəqiqləşdirək.</p>}
                    <button type="button" className={styles.primary} onClick={() => setPhase("contact")}>Ödənişsiz konsultasiya <ArrowRight aria-hidden="true" /></button>
                    <p className={styles.smallNote}>Bu, başlanğıc təklifidir. Plan mentorla dəqiqləşir.</p>
                  </> : null}
                  {phase === "contact" ? <>
                    <p className={styles.message}>{recommendation?.program?.title ?? "İstiqamət konsultasiyası"} üçün demo müraciətini tamamla.</p>
                    <form className={styles.form} onSubmit={completeDemo} noValidate>
                      <label htmlFor="moni-demo-name">Adın<input id="moni-demo-name" name="demoName" autoComplete="given-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Adını yaz" required minLength={2} maxLength={60} aria-invalid={Boolean(formError)} aria-describedby={formError ? "moni-form-error" : undefined} /></label>
                      <label htmlFor="moni-demo-phone">Telefonun<input id="moni-demo-phone" name="demoPhone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+994 50 123 45 67" required maxLength={24} aria-invalid={Boolean(formError)} aria-describedby={formError ? "moni-form-error" : undefined} /></label>
                      {formError ? <p id="moni-form-error" className={styles.formError} role="alert">{formError}</p> : null}
                      <button type="submit" className={styles.primary}>Demo müraciətini tamamla <ArrowRight aria-hidden="true" /></button>
                    </form>
                    <p className={styles.smallNote}>Demo rejimi: məlumatların yalnız bu səhifədə qalır.</p>
                  </> : null}
                  {phase === "complete" ? <>
                    <p className={styles.message}>{name.trim()}, sənət yolunun ilk addımını birlikdə seçdik.</p>
                    <div className={styles.completion}><Check aria-hidden="true" /><div><strong>Demo müraciəti tamamlandı</strong><p>{recommendation?.program?.title ?? "İstiqamət konsultasiyası"}</p></div></div>
                    <p className={styles.smallNote}>Bu sınaqdır. Real müraciət və görüş yaradılmayıb.</p>
                    <button type="button" className={styles.primary} onClick={restart}>Başqa bir yolu kəşf et <RotateCcw aria-hidden="true" /></button>
                  </> : null}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <footer className={styles.chatFooter}>
            <button type="button" className={styles.back} onClick={goBack} disabled={phase === "complete"}><ArrowLeft aria-hidden="true" /><span>Geri</span></button>
            <div className={styles.progress} role="progressbar" aria-label="Sənət yolunun mərhələsi" aria-valuemin={0} aria-valuemax={3} aria-valuenow={progress[phase]}>{[1, 2, 3].map((step) => <span key={step} data-complete={step <= progress[phase]} />)}</div>
            <span className={styles.footerNote}>Seçimlərinə uyğun yönləndirirəm.</span>
          </footer>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
