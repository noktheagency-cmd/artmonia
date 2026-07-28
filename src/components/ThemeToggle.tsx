"use client";

import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "artmonia-theme";
const THEME_CHANGE_EVENT = "artmonia-theme-change";

type Theme = "light" | "dark";

function readStoredTheme(): Theme | null {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }
  } catch {
    // Fall back to the cookie when local storage is unavailable.
  }

  try {
    const cookieTheme = document.cookie
      .split("; ")
      .find((item) => item.startsWith(`${THEME_STORAGE_KEY}=`))
      ?.split("=")[1];

    return cookieTheme === "light" || cookieTheme === "dark" ? cookieTheme : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme) {
  const isDark = theme === "dark";
  const root = document.documentElement;

  root.classList.toggle("theme-dark", isDark);
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  window.dispatchEvent(new CustomEvent<Theme>(THEME_CHANGE_EVENT, { detail: theme }));
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" className="theme-toggle-icon theme-toggle-moon" viewBox="0 0 24 24">
      <path d="M20.2 15.2A8.6 8.6 0 0 1 8.8 3.8 8.7 8.7 0 1 0 20.2 15.2Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg aria-hidden="true" className="theme-toggle-icon theme-toggle-sun" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3.8" />
      <path d="M12 2.2v2.1M12 19.7v2.1M4.3 12H2.2M21.8 12h-2.1M5.1 5.1l1.5 1.5M17.4 17.4l1.5 1.5M18.9 5.1l-1.5 1.5M6.6 17.4l-1.5 1.5" />
    </svg>
  );
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const currentTheme: Theme =
      readStoredTheme() ??
      (document.documentElement.classList.contains("theme-dark") ? "dark" : "light");

    applyTheme(currentTheme);
    setTheme(currentTheme);

    const syncTheme = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY || (event.newValue !== "light" && event.newValue !== "dark")) {
        return;
      }

      applyTheme(event.newValue);
    };

    const syncThemeControls = (event: Event) => {
      const nextTheme = (event as CustomEvent<Theme>).detail;
      if (nextTheme === "light" || nextTheme === "dark") {
        setTheme(nextTheme);
      }
    };

    const restorePersistedTheme = () => {
      const persistedTheme = readStoredTheme();
      if (persistedTheme) {
        applyTheme(persistedTheme);
        setTheme(persistedTheme);
      }
    };

    window.addEventListener("storage", syncTheme);
    window.addEventListener(THEME_CHANGE_EVENT, syncThemeControls);
    window.addEventListener("pageshow", restorePersistedTheme);

    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener(THEME_CHANGE_EVENT, syncThemeControls);
      window.removeEventListener("pageshow", restorePersistedTheme);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    setTheme(nextTheme);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // The theme still works for the current page when storage is unavailable.
    }

    try {
      document.cookie = `${THEME_STORAGE_KEY}=${nextTheme}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      // Some privacy modes also block cookies; the active page remains themed.
    }
  };

  const isDark = theme === "dark";
  const label = isDark ? "İşıqlı temaya keç" : "Qaranlıq temaya keç";

  return (
    <button
      className={["theme-toggle", className].filter(Boolean).join(" ")}
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
    >
      <span className="theme-toggle-icon-wrap" aria-hidden="true">
        <MoonIcon />
        <SunIcon />
      </span>
      <span className="theme-toggle-text">{label}</span>
    </button>
  );
}
