import { managedMetadata } from "@/lib/managed-metadata";

import CollectionPage from "@/components/CollectionPage";

export async function generateMetadata() { return managedMetadata("Mükafatlar | Artmonia Academy", "Artmonia Academy icmasının mükafatları və nailiyyətləri.", "/mukafatlar"); }

export default function AwardsPage() {
  return <CollectionPage type="awards" />;
}
