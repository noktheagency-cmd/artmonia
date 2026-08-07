export type CinematicAsset = {
  poster: string;
  src?: string;
};

/*
 * Keep the cinematic sections photo-first for now. When the final HD videos are
 * ready, add their paths back through `src`; CinematicVideo already supports the
 * transition from the photo to video without any component changes.
 */
export const videoExperience: Record<
  "hero" | "journey" | "atelier",
  CinematicAsset
> = {
  hero: {
    poster: "/assets/artmonia-hero-creation-poster.png"
  },
  journey: {
    poster: "/assets/artmonia-line-to-art-poster.png"
  },
  atelier: {
    poster: "/assets/artmonia-future-atelier-poster.png"
  }
};
