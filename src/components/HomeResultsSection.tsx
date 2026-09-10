"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import styles from "./HomeResultsSection.module.css";

// Fictional demo profiles, not published claims about actual students.
const students = [
  { name: "Aylin Məmmədova", result: "Qabiliyyət imtahanında 10 bal topladı." },
  { name: "Murad Əliyev", result: "Rəssamlıq ixtisasına qəbul oldu." },
  { name: "Nərmin Həsənova", result: "Dizayn ixtisasına qəbul oldu." },
  { name: "Tunar Qasımov", result: "Qabiliyyət imtahanında 9 bal topladı." },
  { name: "Leyla Rzayeva", result: "Arzuladığı sənət ixtisasını qazandı." },
  { name: "Ömər İsmayılov", result: "Memarlıq ixtisasına qəbul oldu." },
  { name: "Dəniz Səfərova", result: "Qabiliyyət imtahanında 10 bal topladı." },
  { name: "Əli Hüseynov", result: "Qrafik dizayn ixtisasını qazandı." },
  { name: "İnci Vəliyeva", result: "Rəngkarlıq ixtisasına qəbul oldu." },
  { name: "Kənan Abbasov", result: "Qabiliyyət imtahanında 9 bal topladı." },
];

export default function HomeResultsSection() {
  const [paused, setPaused] = useState(false);

  return (
    <section className={styles.section} id="results" aria-labelledby="home-results-title">
      <div className={styles.heading}>
        <div>
          <h2 id="home-results-title">Nəticələr</h2>
          <span className={styles.underline} aria-hidden="true" />
          <p>Nümunə profillər — foto, ad və nəticələr demodur.</p>
        </div>
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setPaused(!paused)}
          aria-label={paused ? "Lenti davam etdir" : "Lenti dayandır"}
          aria-pressed={paused}
        >
          {paused ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
        </button>
      </div>
      <div className={styles.viewport} tabIndex={0} aria-label="10 nümunə tələbə nəticəsi">
        <div className={styles.track} data-paused={paused}>
          {[0, 1].map((copy) => (
            <ul className={styles.group} key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {students.map((student, index) => (
                <li className={styles.card} key={student.name}>
                  <div
                    className={styles.portrait}
                    role="img"
                    aria-label={`${student.name} — süni yaradılmış nümunə portret`}
                    style={{ backgroundPosition: `${(index % 5) * 25}% ${index < 5 ? 0 : 100}%` }}
                  />
                  <div className={styles.caption}>
                    <h3>{student.name}</h3>
                    <p>{student.result}</p>
                  </div>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
