export type CinematicAsset = {
  poster: string;
  mobilePoster?: string;
  src?: string;
};

/*
 * Keep the cinematic sections photo-first for now. When the final HD videos are
 * ready, add their paths back through `src`; CinematicVideo already supports the
 * transition from the photo to video without any component changes.
 */
export const videoExperience: Record<
  "hero" | "atelier",
  CinematicAsset
> = {
  hero: {
    poster: "/assets/artmonia-hero-painted-hands-desktop.webp",
    mobilePoster: "/assets/artmonia-hero-painted-hands-mobile.webp"
  },
  atelier: {
    poster: "/assets/artmonia-future-atelier-hd.webp"
  }
};
