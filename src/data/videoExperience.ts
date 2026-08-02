export type CinematicAsset = {
  poster: string;
  src?: string;
};

/* Poster frames keep the experience polished while each video loads or falls back. */
export const videoExperience: Record<
  "hero" | "journey" | "atelier",
  CinematicAsset
> = {
  hero: {
    poster: "/assets/artmonia-hero-creation-poster.png",
    src: "/assets/artmonia-hero-creation.mp4"
  },
  journey: {
    poster: "/assets/artmonia-line-to-art-poster.png",
    src: "/assets/artmonia-line-to-art.mp4"
  },
  atelier: {
    poster: "/assets/artmonia-future-atelier-poster.png"
  }
};
