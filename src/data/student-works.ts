export const studentWorks = {
  label: "Tələbə işləri",
  title: "Sıfırdan bu nəticələrə.",
  description: "Hər iş yeni bir addım, hər məşq yeni bir kəşfdir.",
  allLink: "Bütün tələbə işlərinə bax",
  items: [
    { id: "work-demo-1", name: "Nümunə iş · Portret", category: "Qara qələm", program: "Akademik rəsm", image: "/assets/article-portrait-technique.webp", quote: "Nümunə görüntüdür — real tələbə işi ilə əvəz edin." },
    { id: "work-demo-2", name: "Nümunə iş · Proporsiya", category: "Qara qələm", program: "Akademik rəsm", image: "/assets/article-portrait-proportions.webp", quote: "Nümunə görüntüdür — real tələbə işi ilə əvəz edin." },
    { id: "work-demo-3", name: "Nümunə iş · Kompozisiya", category: "Qara qələm", program: "Kompozisiya", image: "/assets/article-composition.webp", quote: "Nümunə görüntüdür — real tələbə işi ilə əvəz edin." },
    { id: "work-demo-4", name: "Nümunə iş · Rəng", category: "Rəngkarlıq", program: "Rəng & Boyama", image: "/assets/module-color.webp", quote: "Nümunə görüntüdür — real tələbə işi ilə əvəz edin." },
    { id: "work-demo-5", name: "Nümunə iş · Harmoniya", category: "Rəngkarlıq", program: "Rəng & Boyama", image: "/assets/article-color-harmony-crisp.webp", quote: "Nümunə görüntüdür — real tələbə işi ilə əvəz edin." },
    { id: "work-demo-6", name: "Nümunə iş · Portret sənəti", category: "Portret", program: "Portret sənəti", image: "/assets/module-portrait.webp", quote: "Nümunə görüntüdür — real tələbə işi ilə əvəz edin." }
  ].map((item) => ({ ...item, createdAt: "" }))
};
