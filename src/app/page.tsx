import ArtmoniaSite from "@/components/ArtmoniaSite";
import { getPublishedContent } from "@/lib/site-content";

export default async function Home() {
  const content = await getPublishedContent();
  return <ArtmoniaSite content={content} />;
}
