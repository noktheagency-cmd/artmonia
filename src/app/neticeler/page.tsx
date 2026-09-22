import { pageMetadata } from "@/lib/seo";
import CollectionPage from "@/components/CollectionPage";

export const metadata = pageMetadata("Nəticələr | Artmonia Academy", "Artmonia Academy tələbələrinin işləri və inkişaf nəticələri.", "/neticeler");

export default function ResultsPage() {
  return <CollectionPage type="results" />;
}
