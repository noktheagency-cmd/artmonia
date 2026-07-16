import type { Metadata } from "next";
import CollectionPage from "@/components/CollectionPage";

export const metadata: Metadata = {
  title: "Nəticələr | Artmonia Academy",
  description: "Artmonia Academy tələbələrinin işləri və inkişaf nəticələri."
};

export default function ResultsPage() {
  return <CollectionPage type="results" />;
}
