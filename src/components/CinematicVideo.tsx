"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CinematicVideo.module.css";

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
  };
};

type CinematicVideoProps = {
  className?: string;
  eager?: boolean;
  mobilePoster?: string;
  playbackRate?: number;
  poster: string;
  src?: string;
};

export default function CinematicVideo({
  className = "",
  eager = false,
  mobilePoster,
  playbackRate = 1,
  poster,
  src
}: CinematicVideoProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [canLoad, setCanLoad] = useState(eager);
  const [inView, setInView] = useState(eager);
  const [isReady, setIsReady] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true;
    setMotionAllowed(!reducedMotion && !saveData);
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || eager || !src) return;

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setCanLoad(true);
        preloadObserver.disconnect();
      },
      { rootMargin: "480px 0px" }
    );

    preloadObserver.observe(frame);
    return () => preloadObserver.disconnect();
  }, [eager, src]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !src) return;

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.08 }
    );

    visibilityObserver.observe(frame);
    return () => visibilityObserver.disconnect();
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = playbackRate;
  }, [playbackRate, isReady]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isReady) return;

    const syncPlayback = () => {
      const shouldPlay =
        motionAllowed &&
        inView &&
        !hasFailed &&
        document.visibilityState === "visible";

      if (shouldPlay) {
        void video.play().catch(() => {
          setHasFailed(true);
        });
      } else {
        video.pause();
      }
    };

    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);
    return () => document.removeEventListener("visibilitychange", syncPlayback);
  }, [hasFailed, inView, isReady, motionAllowed]);

  const shouldRenderVideo = Boolean(src && canLoad && motionAllowed && !hasFailed);

  return (
    <div
      ref={frameRef}
      className={`${styles.frame} ${mobilePoster ? styles.hasMobilePoster : ""} ${isReady ? styles.ready : ""} ${className}`}
      aria-hidden="true"
    >
      <div
        className={styles.poster}
        style={{ backgroundImage: `url("${poster}")` }}
      />
      {mobilePoster ? (
        <div
          className={`${styles.poster} ${styles.mobilePoster}`}
          style={{ backgroundImage: `url("${mobilePoster}")` }}
        />
      ) : null}
      {shouldRenderVideo ? (
        <video
          ref={videoRef}
          className={styles.video}
          muted
          loop
          playsInline
          preload={eager ? "auto" : "metadata"}
          poster={poster}
          onCanPlay={() => setIsReady(true)}
          onError={() => setHasFailed(true)}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : null}
      <span className={styles.grain} />
    </div>
  );
}
