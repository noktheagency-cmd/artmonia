import type { Metadata } from "next";
import CollectionPage from "@/components/CollectionPage";

export const metadata: Metadata = {
  title: "Mükafatlar | Artmonia Academy",
  description: "Artmonia Academy icmasının mükafatları və nailiyyətləri."
};

export default function AwardsPage() {
  return <CollectionPage type="awards" />;
}
