"use client";

import type { CollectionEntry } from "@/data/collections";
import styles from "./ResultCategories.module.css";

export function resultCategory(item: CollectionEntry) {
  return item.resultCategory?.trim() || "Digər";
}

export default function ResultCategories({ items, selected, onSelect }: {
  items: CollectionEntry[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}) {
  const categories = Array.from(new Set(items.map(resultCategory)));
  return (
    <div className={styles.filters} role="group" aria-label="Nəticə kateqoriyaları">
      <button type="button" aria-pressed={selected === null} onClick={() => onSelect(null)}>Hamısı</button>
      {categories.map((category) => (
        <button key={category} type="button" aria-pressed={selected === category} onClick={() => onSelect(category)}>{category}</button>
      ))}
    </div>
  );
}
