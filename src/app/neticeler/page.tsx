import { managedMetadata } from "@/lib/managed-metadata";

import CollectionPage from "@/components/CollectionPage";

export async function generateMetadata() { return managedMetadata("Nəticələr | Artmonia Academy", "Artmonia Academy tələbələrinin işləri və inkişaf nəticələri.", "/neticeler"); }

export default function ResultsPage() {
  return <CollectionPage type="results" />;
}
