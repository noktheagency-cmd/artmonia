"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Brush,
  Check,
  CircleUserRound,
  Frame,
  Layers3,
  MonitorUp,
  Palette,
  PencilRuler,
  Sparkles
} from "lucide-react";
import { useSiteContentValue } from "@/components/SiteContentContext";
import { applicationPageCopy } from "@/data/site-copy";
import styles from "./ApplicationWizard.module.css";

const interestVisuals = [
  { id: "academic-drawing", icon: PencilRuler },
  { id: "color-painting", icon: Palette },
  { id: "portrait-figure", icon: CircleUserRound },
  { id: "composition", icon: Frame },
  { id: "portfolio", icon: Layers3 },
  { id: "digital-art", icon: MonitorUp },
  { id: "creative-practice", icon: Brush },
  { id: "consultation", icon: Sparkles }
] as const;

type Step = 1 | 2 | 3;

type ApplicationForm = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

const initialForm: ApplicationForm = {
  firstName: "",
  lastName: "",
  phone: "",
  email: ""
};

export default function ApplicationWizard() {
  const [step, setStep] = useState<Step>(1);
  const [interest, setInterest] = useState("");
  const [form, setForm] = useState<ApplicationForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submittingRef = useRef(false);
  const copy = useSiteContentValue("application_page_copy", applicationPageCopy);
  const interests = interestVisuals.map((visual, index) => ({
    ...visual,
    ...(copy.interests[index] ?? applicationPageCopy.interests[index])
  }));

  const selectedInterest = interests.find((item) => item.id === interest);

  function updateField(field: keyof ApplicationForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    if (!form.firstName.trim() || !form.lastName.trim() || !selectedInterest) {
      setSubmitError("Ad, soyad və proqram seçimini yoxlayın.");
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError("");
    const payload = new FormData();
    payload.set("full_name", `${form.firstName.trim()} ${form.lastName.trim()}`);
    payload.set("phone", form.phone.trim());
    payload.set("email", form.email.trim());
    payload.set("interest", selectedInterest.title);
    try {
      const response = await fetch("/api/contact", { method: "POST", body: payload, signal: AbortSignal.timeout(30000) });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) {
        throw new Error(result?.error || "Müraciət göndərilmədi. Yenidən cəhd edin.");
      }
      setStep(3);
    } catch (error) {
      setSubmitError(error instanceof Error && !(error instanceof TypeError) && error.name !== "TimeoutError" ? error.message : "Bağlantı alınmadı. Yazdıqlarınız formadadır; yenidən cəhd edin.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  function resetWizard() {
    setInterest("");
    setForm(initialForm);
    setSubmitError("");
    setStep(1);
  }

  return (
    <main className={styles.page}>
      <section className={styles.wizard} aria-labelledby="application-title">
        <span className={styles.paintStrokeOne} aria-hidden="true" />
        <span className={styles.paintStrokeTwo} aria-hidden="true" />

        {step !== 3 ? (
          <header className={styles.header}>
            <div>
              <h1 id="application-title">{copy.title}</h1>
              <p>{step === 1 ? copy.firstStepLead : copy.secondStepLead}</p>
            </div>

            <div className={styles.progress} aria-label={`2 addımdan ${step}-cisi`}>
              <div className={styles.progressLine} aria-hidden="true">
                <span className={styles.progressFill} data-step={step} />
              </div>
              <div className={styles.progressSteps}>
                <span className={styles.completeStep}><Check aria-hidden="true" /><b>1</b></span>
                <span className={step === 2 ? styles.activeStep : undefined}><b>2</b></span>
              </div>
              <strong>{copy.progressPrefix} {step}-cisi</strong>
            </div>
          </header>
        ) : null}

        {step === 1 ? (
          <div className={styles.stepPanel}>
            <div className={styles.sectionTitle}>
              <div>
              <h2>{copy.firstStepTitle}</h2>
              <p>{copy.firstStepText}</p>
              </div>
              <button className={styles.primaryButton} type="button" disabled={!interest} onClick={() => setStep(2)}>
                {copy.continueButton} <ArrowRight aria-hidden="true" />
              </button>
            </div>

            <div className={styles.optionGrid} role="radiogroup" aria-label="Proqram istiqaməti">
              {interests.map((item) => {
                const Icon = item.icon;
                const selected = interest === item.id;

                return (
                  <button
                    className={selected ? `${styles.option} ${styles.selectedOption}` : styles.option}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setInterest(item.id)}
                    key={item.id}
                  >
                    <span className={styles.optionIcon}><Icon aria-hidden="true" /></span>
                    <span className={styles.optionCopy}>
                      <strong>{item.title}</strong>
                      <small>{item.subtitle}</small>
                    </span>
                    <span className={styles.radio} aria-hidden="true"><i /></span>
                  </button>
                );
              })}
            </div>

          </div>
        ) : null}

        {step === 2 ? (
          <form className={styles.stepPanel} onSubmit={submitApplication} aria-busy={submitting}>
            <div className={styles.sectionTitle}>
              <h2>{copy.contactTitle}</h2>
              <p><strong>{selectedInterest?.title}</strong> {copy.contactTextSuffix}</p>
            </div>

            <div className={styles.formGrid}>
              <label>
                <span>{copy.fields.firstNameLabel}</span>
                <input autoComplete="given-name" required value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} placeholder={copy.fields.firstNamePlaceholder} />
              </label>
              <label>
                <span>{copy.fields.lastNameLabel}</span>
                <input autoComplete="family-name" required value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} placeholder={copy.fields.lastNamePlaceholder} />
              </label>
              <label>
                <span>{copy.fields.phoneLabel}</span>
                <input autoComplete="tel" inputMode="tel" required value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder={copy.fields.phonePlaceholder} />
              </label>
              <label>
                <span>{copy.fields.emailLabel}</span>
                <input autoComplete="email" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder={copy.fields.emailPlaceholder} />
              </label>
            </div>

            {submitError && <p role="alert">{submitError}</p>}
            <div className={styles.stepActions}>
              <button className={styles.secondaryButton} type="button" disabled={submitting} onClick={() => setStep(1)}>
                <ArrowLeft aria-hidden="true" /> {copy.backButton}
              </button>
              <button className={styles.primaryButton} type="submit" disabled={submitting}>
                {submitting ? "Göndərilir..." : copy.submitButton} <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </form>
        ) : null}

        {step === 3 ? (
          <div className={styles.successPanel}>
            <span className={styles.successIcon}><Check aria-hidden="true" /></span>
            <p className={styles.successLabel}>{copy.successLabel}</p>
            <h1>{copy.successTitlePrefix} {form.firstName}.</h1>
            <p>
              <strong>{selectedInterest?.title}</strong> {copy.successTextSuffix}
            </p>
            <div className={styles.successActions}>
              <Link className={styles.primaryButton} href="/">{copy.homeButton} <ArrowRight aria-hidden="true" /></Link>
              <button className={styles.secondaryButton} type="button" onClick={resetWizard}>{copy.newApplicationButton}</button>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
