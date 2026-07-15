import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Artmonia Academy | Sənətə sistemli başlanğıc",
  description:
    "Akademik rəsm, rəng, kompozisiya və portfolyo hazırlığı üçün mentor dəstəkli Artmonia Academy proqramları.",
  openGraph: {
    title: "Artmonia Academy",
    description: "Fırçanı tut, sənətkar ol. Sistemli tədris, mentor rəyi və görünən nəticə.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az">
      <body>{children}</body>
    </html>
  );
}
