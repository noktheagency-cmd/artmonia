"use client";

/* The logo is an existing brand asset and needs its original proportions. */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "@/data/site";
import { useSiteContentValue } from "@/components/SiteContentContext";

function HeaderArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="icon">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="menu-svg">
      <path className={open ? "line line-one open" : "line line-one"} d="M4 7h16" />
      <path className={open ? "line line-two open" : "line line-two"} d="M4 12h16" />
      <path className={open ? "line line-three open" : "line line-three"} d="M4 17h16" />
    </svg>
  );
}

export default function SiteHeader() {
  const dynamicNavItems = useSiteContentValue("nav_items", navItems);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const visibleNavItems = dynamicNavItems.some((item) => item.href === "/yenilikler")
    ? dynamicNavItems
    : [
        ...dynamicNavItems.slice(0, 2),
        { label: "Yeniliklər", href: "/yenilikler" },
        ...dynamicNavItems.slice(2)
      ];

  const isActive = (href: string) => href.startsWith("/") && !href.includes("#") && pathname === href;

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Artmonia ana səhifə">
        <img className="brand-logo brand-logo-light" src="/assets/artmonia-logo.webp" alt="Artmonia" />
      </Link>

      <nav className="desktop-nav" aria-label="Əsas naviqasiya">
        {visibleNavItems.map((item) =>
          item.href.endsWith("#program") ? (
            <div className="nav-program-menu" key={item.href}>
              <Link className="nav-program-trigger" href={item.href} aria-haspopup="true">
                {item.label}
                <span aria-hidden="true">⌄</span>
              </Link>
              <div className="nav-program-dropdown">
                <Link href="/#pricing">Paketlər və qiymətlər</Link>
              </div>
            </div>
          ) : (
            <Link
              className={[
                isActive(item.href) ? "is-active" : "",
                item.href === "/yenilikler" ? "nav-news-link" : ""
              ].filter(Boolean).join(" ") || undefined}
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.href === "/yenilikler" ? <span className="nav-news-dot" aria-hidden="true" /> : null}
              <span>{item.label}</span>
            </Link>
          )
        )}
      </nav>

      <div className="header-actions">
        <Link className="nav-cta" href="/#lead">
          Qeydiyyat <HeaderArrowIcon />
        </Link>
      </div>

      <button
        className="menu-button"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Menyunu bağla" : "Menyunu aç"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
      >
        <MenuIcon open={open} />
      </button>

      <nav id="mobile-navigation" className={open ? "mobile-nav open" : "mobile-nav"} aria-label="Mobil naviqasiya">
        {visibleNavItems.map((item) =>
          item.href.endsWith("#program") ? (
            <div className="mobile-program-group" key={item.href}>
              <Link href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
              <div className="mobile-program-links">
                <Link href="/#pricing" onClick={() => setOpen(false)}>Paketlər və qiymətlər</Link>
              </div>
            </div>
          ) : (
            <Link
              className={[
                isActive(item.href) ? "is-active" : "",
                item.href === "/yenilikler" ? "mobile-news-link" : ""
              ].filter(Boolean).join(" ") || undefined}
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.href === "/yenilikler" ? <span className="nav-news-dot" aria-hidden="true" /> : null}
              <span>{item.label}</span>
            </Link>
          )
        )}
        <Link href="/#lead" onClick={() => setOpen(false)}>
          Qeydiyyat
        </Link>
      </nav>
    </header>
  );
}
