"use client";

/* CMS images are already validated by the content editor. */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { createPortal } from "react-dom";
import { moniDefaults, moniGoals, moniLevels, type MoniPlan } from "@/data/moni";
import MoniMascot from "./MoniMascot";
import styles from "./MoniGuide.module.css";

type Stage = "goal" | "level" | "note" | "loading" | "plan" | "contact" | "success";
export default function MoniPanel({ copy, onClose }: { copy: typeof moniDefaults; onClose: () => void }) {
  const [stage, setStage] = useState<Stage>("goal");
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [plan, setPlan] = useState<MoniPlan | null>(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const panel = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const request = useRef<AbortController | null>(null);
  const submitting = useRef(false);
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const items = Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), textarea:not(:disabled), [tabindex="0"]') ?? []).filter((item) => item.getClientRects().length);
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panel.current)) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", keydown); request.current?.abort(); previousFocus?.focus(); };
    // Dialog lifetime, not the parent callback identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { heading.current?.focus(); panel.current?.querySelector(`.${styles.body}`)?.scrollTo(0, 0); }, [stage]);
  async function preparePlan(event: React.FormEvent) {
    event.preventDefault();
    if (!consent || submitting.current) return;
    submitting.current = true;
    setError(""); setStage("loading");
    const controller = new AbortController(); request.current = controller;
    const timer = setTimeout(() => controller.abort(), 27000);
    try {
      const response = await fetch("/api/moni", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ goal, level, note, consent }), signal: controller.signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Plan hazırlanmadı.");
      setPlan(data); setStage("plan");
    } catch (cause) {
      if (controller.signal.aborted) setError("Cavab gecikdi. Yenidən yoxla və ya konsultasiya formasına keç.");
      else setError(cause instanceof Error ? cause.message : "Bağlantını yoxla və yenidən cəhd et.");
      setStage("note");
    } finally { clearTimeout(timer); submitting.current = false; }
  }
  async function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!plan || submitting.current) return;
    submitting.current = true; setSending(true); setError("");
    const form = new FormData(event.currentTarget);
    form.set("moni_token", plan.token);
    const controller = new AbortController(); request.current = controller;
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch("/api/contact", { method: "POST", body: form, signal: controller.signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Müraciət göndərilmədi.");
      setStage("success");
    } catch (cause) { setError(cause instanceof Error && cause.name !== "AbortError" ? cause.message : "Bağlantı kəsildi. Yenidən yoxla."); }
    finally { clearTimeout(timer); setSending(false); submitting.current = false; }
  }
  const title = stage === "goal" ? copy.goalQuestion : stage === "level" ? copy.levelQuestion : stage === "note" ? copy.noteQuestion : stage === "loading" ? "Sənin sənət yolunu çəkirəm…" : stage === "plan" ? "Sənin sənət yolun" : stage === "contact" ? "İlk addımı birlikdə ataq" : "Artıq bir addım yaxındasan!";
  return createPortal(<div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={panel} className={styles.panel} role="dialog" aria-modal="true" aria-labelledby="moni-heading" tabIndex={-1}>
      <header className={styles.header}><div><strong>Moni</strong><span>Artmonianın AI köməkçisi</span></div><button className={styles.close} onClick={onClose} aria-label="Söhbəti bağla"><X size={22} /></button></header>
      <div className={styles.body}>
        {!["plan", "contact"].includes(stage) && <div className={styles.portrait}><MoniMascot state={stage === "loading" ? "think" : stage === "success" ? "laugh" : "hello"} /></div>}
        <h2 ref={heading} tabIndex={-1} id="moni-heading">{title}</h2>
        {stage === "goal" && <><p>Məqsədini seç, sənə uyğun başlanğıcı tapaq.</p><div className={styles.choices}>{moniGoals.map((item) => <button key={item} onClick={() => { setGoal(item); setStage("level"); }}>{item}<ArrowRight size={18} /></button>)}</div></>}
        {stage === "level" && <><p>Hər başlanğıcın öz gözəlliyi var.</p><div className={styles.choices}>{moniLevels.map((item) => <button key={item} onClick={() => { setLevel(item); setStage("note"); }}>{item}<ArrowRight size={18} /></button>)}</div><button className={styles.back} onClick={() => setStage("goal")}><ArrowLeft size={16} />Geri</button></>}
        {stage === "note" && <form onSubmit={preparePlan} className={styles.form}>
          <p>Vaxtın azdır, özünə güvənmirsən, yoxsa xüsusi istiqamət maraqlıdır? İstəsən, qısaca yaz.</p>
          <label htmlFor="moni-note">Qeydin <span>(istəyə bağlı)</span></label>
          <textarea id="moni-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={500} rows={3} placeholder="Məsələn: işdən sonra özüm üçün rəsm öyrənmək istəyirəm." />
          <small>Ad, telefon və başqa şəxsi məlumat yazma.</small>
          <label className={styles.consent}><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required /><span>Seçimlərimin və qeydimin şəxsi plan üçün OpenRouter / Gemini AI ilə işlənməsinə razıyam.</span></label>
          <button className={styles.primary} type="submit" disabled={!consent}>Sənət yolumu hazırla<ArrowRight size={18} /></button>
          <button type="button" className={styles.back} onClick={() => setStage("level")}><ArrowLeft size={16} />Geri</button>
        </form>}
        {stage === "loading" && <p role="status" className={styles.loading}>Seçimlərini proqramlarımızla uyğunlaşdırıram. Bu, bir neçə saniyə çəkə bilər.</p>}
        {stage === "plan" && plan && <>
          <p>{plan.reason}</p>
          <ol className={styles.path}>{plan.steps.map((step, index) => <li key={index} style={{ animationDelay: `${index * 160}ms` }}><span>{index + 1}</span><strong>{step}</strong></li>)}</ol>
          <article className={styles.course}><h3>{plan.course.title}</h3><p>{plan.course.text}</p><dl><div><dt>Müddət</dt><dd>{plan.course.duration || "Komandamızla dəqiqləşdirin"}</dd></div><div><dt>Qiymət</dt><dd>{plan.course.price || "Qiymət üçün əlaqə saxlayın"}</dd></div></dl><Link href={plan.course.href}>Proqramla tanış ol<ArrowRight size={15} /></Link></article>
          {plan.proof && <figure className={styles.proof}><img src={plan.proof.image} alt={`${plan.proof.name} — tələbə nəticəsi`} loading="lazy" /><figcaption><strong>{plan.proof.name}</strong><span>{plan.proof.result}</span></figcaption></figure>}
          <p className={styles.disclaimer}>Bu, seçimlərinə əsaslanan başlanğıc təklifidir. Uyğun proqramı və cədvəli konsultasiyada dəqiqləşdirəcəyik.</p>
          <button className={styles.primary} onClick={() => setStage("contact")}>{copy.consultationLabel}<ArrowRight size={18} /></button>
          <button className={styles.back} onClick={() => { setError(""); setStage("note"); }}>Planı dəqiqləşdir</button>
        </>}
        {stage === "contact" && plan && <form className={styles.form} onSubmit={submitContact}>
          <p><strong>{plan.course.title}</strong> üçün seçimlərini komandamıza ötürəcəyik. Yenidən izah etməyinə ehtiyac yoxdur.</p>
          <label htmlFor="moni-name">Ad və soyad</label><input id="moni-name" name="full_name" autoComplete="name" minLength={2} maxLength={120} required placeholder="Ad və soyadın" />
          <label htmlFor="moni-phone">Telefon nömrən</label><input id="moni-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} required placeholder="+994 …" />
          <div className={styles.honeypot} aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
          <label className={styles.consent}><input name="consent" value="true" type="checkbox" required /><span>Əlaqə məlumatlarımın və seçimlərimin konsultasiya üçün Artmonia komandasına göndərilməsinə razıyam. Adım və telefonum AI-yə göndərilmir.</span></label>
          <button type="submit" className={styles.primary} disabled={sending}>{sending ? "Göndərilir…" : "Müraciəti göndər"}<ArrowRight size={18} /></button>
          <button type="button" className={styles.back} disabled={sending} onClick={() => { setError(""); setStage("plan"); }}><ArrowLeft size={16} />Plana qayıt</button>
        </form>}
        {stage === "success" && <><p role="status">{copy.successMessage}</p><button className={styles.primary} onClick={onClose}><Check size={18} />Sayta qayıt</button></>}
        {error && <div className={styles.error} role="alert"><p>{error}</p><Link href="/muraciet">Konsultasiya formasını aç<ArrowRight size={16} /></Link></div>}
      </div>
      <footer className={styles.footer}>Sənin tempin. Sənin sənət yolun.</footer>
    </section>
  </div>, document.body);
}
