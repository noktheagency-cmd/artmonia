"use client";

/* Display the supplied certificate in its original proportions. */
/* eslint-disable @next/next/no-img-element */

import { useRef } from "react";
import { ArrowUpRight, Maximize2, X } from "lucide-react";
import styles from "./ProgramCertificate.module.css";

const certificateImage = "/assets/artmonia-certificate-sample.png";

export default function ProgramCertificate() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <section className={styles.section} aria-labelledby="certificate-title">
      <div className={styles.copy}>
        <span className={styles.eyebrow}>Proqramın sonunda</span>
        <h2 id="certificate-title">Əməyinin qarşılığı — <em>sertifikat.</em></h2>
        <p>Proqramı uğurla tamamladıqda, öyrəndiyin bacarıqları əks etdirən Artmonia sertifikatı əldə edirsən.</p>
        <button className={styles.previewLink} type="button" onClick={() => dialogRef.current?.showModal()}>
          Sertifikata yaxından bax <ArrowUpRight size={20} aria-hidden="true" />
        </button>
      </div>

      <figure className={styles.preview}>
        <button className={styles.frame} type="button" onClick={() => dialogRef.current?.showModal()} aria-label="Sertifikat nümunəsini böyüt">
          <img src={certificateImage} width={1055} height={1491} alt="Artmonia tədris proqramını tamamlama sertifikatının nümunəsi" loading="lazy" />
          <span className={styles.zoomIcon}><Maximize2 size={18} aria-hidden="true" /></span>
        </button>
        <figcaption>Sertifikat nümunəsi</figcaption>
      </figure>

      <dialog className={styles.dialog} ref={dialogRef} aria-labelledby="certificate-dialog-title" onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
      }}>
        <header className={styles.dialogHeader}>
          <h3 id="certificate-dialog-title">Sertifikat nümunəsi</h3>
          <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Sertifikatı bağla"><X size={22} aria-hidden="true" /></button>
        </header>
        <img src={certificateImage} width={1055} height={1491} alt="Artmonia sertifikatının tam görünüşü" />
      </dialog>
    </section>
  );
}
