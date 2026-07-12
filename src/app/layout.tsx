import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Artmonia Academy - Modern Rəssamlıq Akademiyası",
  description:
    "Artmonia Academy üçün klassik-modern, responsiv Next.js frontend konsepti: proqramlar, nəticələr, müəllimlər, FAQ və qeydiyyat axını.",
  openGraph: {
    title: "Artmonia Academy",
    description: "Sistem. Rəy. Nəticə - modern klassik rəssamlıq akademiyası.",
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
