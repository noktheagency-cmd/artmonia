"use client";

/* The logo is an existing brand asset and needs its original proportions. */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { useSiteContentValue } from "@/components/SiteContentContext";
import { globalCopy } from "@/data/site-copy";

const navigationRoutes = [
  { href: "/#program", children: ["/#program", "/#pricing"] },
  { href: "/akademiya", children: ["/akademiya#interyer", "/akademiya#haqqimizda"] },
  { href: "/neticeler", children: ["/neticeler#ugur-hekayeleri", "/neticeler#telebe-neticeleri"] },
  { href: "/#teachers", children: [] },
  { href: "/#contact", children: [] }
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="icon">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 8" className="nav-chevron">
      <path d="m1 1 5 5 5-5" />
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
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const copy = useSiteContentValue("global_copy", globalCopy);
  const navigation = navigationRoutes.map((route, index) => {
    const item = copy.navigation[index] ?? globalCopy.navigation[index];
    const fallbackItem = globalCopy.navigation[index];
    return {
      label: item.label,
      href: route.href,
      children: route.children.map((href, childIndex) => ({
        href,
        label: item.children[childIndex] ?? fallbackItem.children[childIndex]
      }))
    };
  });

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return !href.includes("#") && pathname === href;
  };

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Artmonia ana səhifə">
        <img className="brand-logo brand-logo-light" src="/assets/artmonia-logo.webp" alt="Artmonia" />
        <img className="brand-logo brand-logo-dark" src="/assets/artmonia-logo-dark.webp" alt="" aria-hidden="true" />
      </Link>

      <nav className="desktop-nav" aria-label="Əsas naviqasiya">
        {navigation.map((item) =>
          item.children.length ? (
            <div className="nav-program-menu" key={item.label}>
              <Link
                className={isActive(item.href) ? "nav-program-trigger is-active" : "nav-program-trigger"}
                href={item.href}
                aria-haspopup="true"
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
                <ChevronIcon />
              </Link>
              <div className="nav-program-dropdown">
                {item.children.map((child) => (
                  <Link href={child.href} key={child.href}>{child.label}</Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              className={isActive(item.href) ? "is-active" : undefined}
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          )
        )}
      </nav>

      <div className="header-actions">
        <ThemeToggle />
        <Link className="nav-cta" href="/muraciet">
          {copy.applicationCta} <ArrowIcon />
        </Link>
      </div>

      <ThemeToggle className="compact-mobile-theme-toggle" />

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
        {navigation.map((item) => (
          <div className={item.children.length ? "mobile-program-group" : undefined} key={item.label}>
            <Link href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
            {item.children.length ? (
              <div className="mobile-program-links">
                {item.children.map((child) => (
                  <Link href={child.href} key={child.href} onClick={() => setOpen(false)}>
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ))}
        <Link className="mobile-cta" href="/muraciet" onClick={() => setOpen(false)}>
          {copy.applicationCta} <ArrowIcon />
        </Link>
      </nav>
    </header>
  );
}
