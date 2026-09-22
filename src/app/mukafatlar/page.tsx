import { pageMetadata } from "@/lib/seo";
import CollectionPage from "@/components/CollectionPage";

export const metadata = pageMetadata("Mükafatlar | Artmonia Academy", "Artmonia Academy icmasının mükafatları və nailiyyətləri.", "/mukafatlar");

export default function AwardsPage() {
  return <CollectionPage type="awards" />;
}
