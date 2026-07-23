"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
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
import styles from "./ApplicationWizard.module.css";

const interests = [
  {
    id: "academic-drawing",
    title: "Akademik rəsm",
    subtitle: "Sıfırdan möhkəm klassik təməl",
    icon: PencilRuler
  },
  {
    id: "color-painting",
    title: "Rəng və boyama",
    subtitle: "Yağlı boya, akrilik və akvarel",
    icon: Palette
  },
  {
    id: "portrait-figure",
    title: "Portret və fiqur",
    subtitle: "Anatomiya, proporsiya və ifadə",
    icon: CircleUserRound
  },
  {
    id: "composition",
    title: "Kompozisiya",
    subtitle: "Vizual tarazlıq və yaradıcı baxış",
    icon: Frame
  },
  {
    id: "portfolio",
    title: "Portfolio hazırlığı",
    subtitle: "Qəbul və təqdimat üçün seçilmiş işlər",
    icon: Layers3
  },
  {
    id: "digital-art",
    title: "Rəqəmsal sənət",
    subtitle: "Procreate və Photoshop istiqaməti",
    icon: MonitorUp
  },
  {
    id: "creative-practice",
    title: "Yaradıcı praktika",
    subtitle: "Fərdi üslub və sərbəst eksperiment",
    icon: Brush
  },
  {
    id: "consultation",
    title: "İstiqamət konsultasiyası",
    subtitle: "Mənə uyğun proqramı birlikdə seçək",
    icon: Sparkles
  }
] as const;

type Step = 1 | 2 | 3;

type ApplicationForm = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  format: string;
  note: string;
};

const initialForm: ApplicationForm = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  format: "",
  note: ""
};

export default function ApplicationWizard() {
  const [step, setStep] = useState<Step>(1);
  const [interest, setInterest] = useState("");
  const [form, setForm] = useState<ApplicationForm>(initialForm);

  const selectedInterest = useMemo(
    () => interests.find((item) => item.id === interest),
    [interest]
  );

  function updateField(field: keyof ApplicationForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // The selected program and form state are kept together so a future backend
    // request can send this payload without changing the UI flow.
    setStep(3);
  }

  function resetWizard() {
    setInterest("");
    setForm(initialForm);
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
              <h1 id="application-title">Müraciət et</h1>
              <p>{step === 1 ? "Sənət yolunu birlikdə seçək." : "Son addım — sizinlə əlaqə saxlayaq."}</p>
            </div>

            <div className={styles.progress} aria-label={`2 addımdan ${step}-cisi`}>
              <div className={styles.progressLine} aria-hidden="true">
                <span className={styles.progressFill} data-step={step} />
              </div>
              <div className={styles.progressSteps}>
                <span className={styles.completeStep}><Check aria-hidden="true" /><b>1</b></span>
                <span className={step === 2 ? styles.activeStep : undefined}><b>2</b></span>
              </div>
              <strong>2 addımdan {step}-cisi</strong>
            </div>
          </header>
        ) : null}

        {step === 1 ? (
          <div className={styles.stepPanel}>
            <div className={styles.sectionTitle}>
              <h2>Hansı istiqamət səni daha çox çəkir?</h2>
              <p>Bir seçim et. Sonradan mentorla birlikdə dəyişə bilərik.</p>
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

            <div className={styles.stepActionsEnd}>
              <button className={styles.primaryButton} type="button" disabled={!interest} onClick={() => setStep(2)}>
                Davam et <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <form className={styles.stepPanel} onSubmit={submitApplication}>
            <div className={styles.sectionTitle}>
              <h2>Əlaqə məlumatların</h2>
              <p><strong>{selectedInterest?.title}</strong> istiqaməti üçün ilkin müraciəti tamamla.</p>
            </div>

            <div className={styles.formGrid}>
              <label>
                <span>Ad *</span>
                <input autoComplete="given-name" required value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} placeholder="Adınızı daxil edin" />
              </label>
              <label>
                <span>Soyad *</span>
                <input autoComplete="family-name" required value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} placeholder="Soyadınızı daxil edin" />
              </label>
              <label>
                <span>Telefon nömrəsi *</span>
                <input autoComplete="tel" inputMode="tel" required value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="+994 50 123 45 67" />
              </label>
              <label>
                <span>Elektron poçt</span>
                <input autoComplete="email" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="email@numune.az" />
              </label>
              <label className={styles.wideField}>
                <span>Tədris formatı *</span>
                <select required value={form.format} onChange={(event) => updateField("format", event.target.value)}>
                  <option value="" disabled>Formatı seçin</option>
                  <option value="studio">Studiyada əyani</option>
                  <option value="online">Onlayn</option>
                  <option value="either">Hər ikisi uyğundur</option>
                </select>
              </label>
              <label className={styles.wideField}>
                <span>Qeydiniz</span>
                <textarea rows={3} value={form.note} onChange={(event) => updateField("note", event.target.value)} placeholder="Məqsədiniz və ya uyğun olduğunuz vaxt haqqında qısa qeyd..." />
              </label>
            </div>

            <div className={styles.stepActions}>
              <button className={styles.secondaryButton} type="button" onClick={() => setStep(1)}>
                <ArrowLeft aria-hidden="true" /> Geri
              </button>
              <button className={styles.primaryButton} type="submit">
                Göndər <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </form>
        ) : null}

        {step === 3 ? (
          <div className={styles.successPanel}>
            <span className={styles.successIcon}><Check aria-hidden="true" /></span>
            <p className={styles.successLabel}>Müraciət tamamlandı</p>
            <h1>Təşəkkür edirik, {form.firstName}.</h1>
            <p>
              <strong>{selectedInterest?.title}</strong> istiqaməti üzrə ilkin müraciətiniz tamamlandı.
              Komandamız uyğun proqram və dərs vaxtını dəqiqləşdirmək üçün sizinlə əlaqə saxlayacaq.
            </p>
            <div className={styles.successActions}>
              <Link className={styles.primaryButton} href="/">Ana səhifəyə qayıt <ArrowRight aria-hidden="true" /></Link>
              <button className={styles.secondaryButton} type="button" onClick={resetWizard}>Yeni müraciət</button>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
