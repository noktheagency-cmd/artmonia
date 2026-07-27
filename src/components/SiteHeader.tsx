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
  const navItemsWithNews = dynamicNavItems.some((item) => item.href === "/yenilikler")
    ? dynamicNavItems
    : [
        ...dynamicNavItems.slice(0, 2),
        { label: "Yeniliklər", href: "/yenilikler" },
        ...dynamicNavItems.slice(2)
      ];
  const newsNavItem = navItemsWithNews.find((item) => item.href === "/yenilikler")
    ?? { label: "Yeniliklər", href: "/yenilikler" };
  const visibleNavItems = [
    newsNavItem,
    ...navItemsWithNews.filter((item) => item.href !== "/yenilikler")
  ];

  const isActive = (href: string) => href.startsWith("/") && !href.includes("#") && pathname === href;
  const isAcademyNavItem = (href: string, label: string) =>
    href === "/akademiya" || href.endsWith("#academy") || label === "Akademiya";

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
          ) : isAcademyNavItem(item.href, item.label) ? (
            <div className="nav-program-menu nav-academy-menu" key={item.href}>
              <Link
                className={pathname === "/akademiya" ? "nav-program-trigger is-active" : "nav-program-trigger"}
                href="/akademiya"
                aria-haspopup="true"
                aria-current={pathname === "/akademiya" ? "page" : undefined}
              >
                {item.label}
                <span aria-hidden="true">⌄</span>
              </Link>
              <div className="nav-program-dropdown nav-academy-dropdown">
                <Link href="/akademiya#interyer">İnteryer</Link>
                <Link href="/akademiya#haqqimizda">Haqqımızda</Link>
              </div>
            </div>
          ) : item.href === "/neticeler" ? (
            <div className="nav-program-menu nav-results-menu" key={item.href}>
              <Link className="nav-program-trigger" href={item.href} aria-haspopup="true">
                {item.label}
                <span aria-hidden="true">⌄</span>
              </Link>
              <div className="nav-program-dropdown nav-results-dropdown">
                <Link href="/neticeler#ugur-hekayeleri">Uğur hekayələri</Link>
                <Link href="/neticeler#telebe-neticeleri">Tələbə nəticələri</Link>
              </div>
            </div>
          ) : item.href === "/mukafatlar" ? (
            <div className="nav-program-menu nav-awards-menu" key={item.href}>
              <Link className="nav-program-trigger" href={item.href} aria-haspopup="true">
                {item.label}
                <span aria-hidden="true">⌄</span>
              </Link>
              <div className="nav-program-dropdown nav-awards-dropdown">
                <Link href="/mukafatlar#pul-mukafatlari">Pul mükafatları</Link>
                <Link href="/mukafatlar#seyahet-mukafatlari">Səyahət mükafatları</Link>
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
        <Link className="nav-cta" href="/muraciet">
          Müraciət et <HeaderArrowIcon />
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
          ) : isAcademyNavItem(item.href, item.label) ? (
            <div className="mobile-program-group mobile-academy-group" key={item.href}>
              <Link href="/akademiya" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
              <div className="mobile-program-links">
                <Link href="/akademiya#interyer" onClick={() => setOpen(false)}>İnteryer</Link>
                <Link href="/akademiya#haqqimizda" onClick={() => setOpen(false)}>Haqqımızda</Link>
              </div>
            </div>
          ) : item.href === "/neticeler" ? (
            <div className="mobile-program-group mobile-results-group" key={item.href}>
              <Link href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
              <div className="mobile-program-links">
                <Link href="/neticeler#ugur-hekayeleri" onClick={() => setOpen(false)}>Uğur hekayələri</Link>
                <Link href="/neticeler#telebe-neticeleri" onClick={() => setOpen(false)}>Tələbə nəticələri</Link>
              </div>
            </div>
          ) : item.href === "/mukafatlar" ? (
            <div className="mobile-program-group mobile-awards-group" key={item.href}>
              <Link href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
              <div className="mobile-program-links">
                <Link href="/mukafatlar#pul-mukafatlari" onClick={() => setOpen(false)}>Pul mükafatları</Link>
                <Link href="/mukafatlar#seyahet-mukafatlari" onClick={() => setOpen(false)}>Səyahət mükafatları</Link>
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
        <Link href="/muraciet" onClick={() => setOpen(false)}>
          Müraciət et
        </Link>
      </nav>
    </header>
  );
}
