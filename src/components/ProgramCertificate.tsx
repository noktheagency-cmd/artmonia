"use client";

/* Display the supplied certificate in its original proportions. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Maximize2, X } from "lucide-react";
import styles from "./ProgramCertificate.module.css";
import type { Certificate } from "@/lib/certificates";

export default function ProgramCertificate({ certificate: initialCertificate, program }: { certificate: Certificate; program: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [certificate, setCertificate] = useState(initialCertificate);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/certificates?program=${encodeURIComponent(program)}`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (response.status === 404) { setCertificate((current) => ({ ...current, enabled: false })); return; }
        if (!response.ok) return; // Keep the server-rendered certificate during temporary API outages.
        const body = await response.json();
        if (body.certificates?.[0]) setCertificate(body.certificates[0]);
      }).catch(() => { /* Aborted navigation or temporary offline state: retain SSR content. */ });
    return () => controller.abort();
  }, [program]);
  if (!certificate.enabled || !certificate.image.trim()) return null;

  return (
    <section className={styles.section} aria-labelledby="certificate-title">
      <div className={styles.copy}>
        <span className={styles.eyebrow}>{certificate.eyebrow}</span>
        <h2 id="certificate-title">{certificate.title} <em>{certificate.highlightedTitle}</em></h2>
        <p>{certificate.description}</p>
        <button className={styles.previewLink} type="button" onClick={() => dialogRef.current?.showModal()}>
          {certificate.buttonLabel} <ArrowUpRight size={20} aria-hidden="true" />
        </button>
      </div>

      <figure className={styles.preview}>
        <button className={styles.frame} type="button" onClick={() => dialogRef.current?.showModal()} aria-label="Sertifikat nümunəsini böyüt">
          <img src={certificate.image} width={1055} height={1491} alt={certificate.imageAlt} loading="lazy" />
          <span className={styles.zoomIcon}><Maximize2 size={18} aria-hidden="true" /></span>
        </button>
        <figcaption>{certificate.caption}</figcaption>
      </figure>

      <dialog className={styles.dialog} ref={dialogRef} aria-labelledby="certificate-dialog-title" onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
      }}>
        <header className={styles.dialogHeader}>
          <h3 id="certificate-dialog-title">{certificate.caption || certificate.title}</h3>
          <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Sertifikatı bağla"><X size={22} aria-hidden="true" /></button>
        </header>
        <img src={certificate.image} width={1055} height={1491} alt={certificate.imageAlt} />
      </dialog>
    </section>
  );
}
