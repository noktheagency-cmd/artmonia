import type { Metadata } from "next";
import "./globals.css";
import "./studio-heading.css";

const themeInitializer = `
  (function () {
    try {
      var storedTheme = null;
      try {
        storedTheme = window.localStorage.getItem("artmonia-theme");
      } catch (_) {}
      var cookieMatch = document.cookie.match(/(?:^|;\\s*)artmonia-theme=(light|dark)(?:;|$)/);
      var cookieTheme = cookieMatch ? cookieMatch[1] : null;
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var theme = storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : (cookieTheme || (prefersDark ? "dark" : "light"));
      var root = document.documentElement;
      root.classList.toggle("theme-dark", theme === "dark");
      root.dataset.theme = theme;
      root.style.colorScheme = theme;
    } catch (_) {
      document.documentElement.dataset.theme = "light";
    }
  })();
`;

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
    <html lang="az" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializer }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
