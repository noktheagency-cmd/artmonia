import { transformations, galleryImages } from "@/data/site";
import { homePageCopy } from "@/data/site-copy";
export const transformationDefaults = {
  label: homePageCopy.problem.transformationLabel,
  title: homePageCopy.problem.transformationTitle,
  image: galleryImages[1].src,
  alt: galleryImages[1].alt,
  items: transformations.map((item) => ({ ...item, image: "" }))
};
