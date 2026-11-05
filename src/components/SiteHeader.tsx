"use client";

/* The logo is an existing brand asset and needs its original proportions. */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { useSiteContentValue } from "@/components/SiteContentContext";
import { globalCopy } from "@/data/site-copy";

const navigationRoutes = [
  { href: "/#program", children: ["/#program"] },
  { href: "/akademiya", children: ["/akademiya#interyer", "/akademiya#haqqimizda", "/blog"] },
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
    <svg aria-hidden="true" viewBox="0 0 48 48" className={open ? "menu-palette is-open" : "menu-palette"}>
      <path className="menu-palette-body" d="M23.8 4.5C13 4.5 4.5 12.1 4.5 21.7c0 9.1 7.1 16.1 16.8 16.1h3.2c2.5 0 4.2-2.2 3.5-4.5-.6-2 .9-3.8 3-3.8h3.1c5.5 0 9.4-3.6 9.4-8.6 0-9.3-8.9-16.4-19.7-16.4Z" />
      <circle cx="14" cy="19" r="2.4" fill="#8960ca" />
      <circle cx="21" cy="13" r="2.4" fill="#d59342" />
      <circle cx="29" cy="14" r="2.4" fill="#55a294" />
      <circle cx="35" cy="20" r="2.4" fill="#c47791" />
      <circle className="menu-palette-thumb" cx="14" cy="29" r="3.2" />
    </svg>
  );
}

function childHref(parentHref: string, label: string) {
  const slug = label.trim().toLowerCase()
    .replace(/[ə]/g, "e")
    .replace(/[ı]/g, "i")
    .replace(/[ş]/g, "s")
    .replace(/[ç]/g, "c")
    .replace(/[ğ]/g, "g")
    .replace(/[ö]/g, "o")
    .replace(/[ü]/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!slug) return parentHref;
  const basePath = parentHref.split("#")[0] || "/";
  return `${basePath}#${slug}`;
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        headerRef.current?.querySelector<HTMLButtonElement>(".menu-button")?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", closeOutside); document.removeEventListener("keydown", escape); };
  }, [open]);

  useEffect(() => {
    setActiveSection("");
    if (pathname !== "/") return;
    const sectionIds = navigationRoutes
      .map((route) => route.href.split("#")[1])
      .filter((id): id is string => Boolean(id));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section instanceof HTMLElement);
    if (!sections.length) return;

    let trackedHash = "";
    let targetSeen = false;
    let frame = 0;
    const syncActiveSection = () => {
      const marker = window.innerHeight * 0.5;
      const current = sections.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= marker && bounds.bottom >= marker;
      });
      setActiveSection(current?.id ?? "");

      const hash = window.location.hash;
      if (hash !== trackedHash) {
        trackedHash = hash;
        targetSeen = false;
      }
      const target = sections.find((section) => `#${section.id}` === hash);
      if (!target) return;
      const bounds = target.getBoundingClientRect();
      const headerBottom = headerRef.current?.getBoundingClientRect().bottom ?? 0;
      const visible = bounds.top < window.innerHeight && bounds.bottom > headerBottom;
      // Preserve incoming deep links until navigation has reached their section.
      if (visible) targetSeen = true;
      else if (targetSeen) {
        window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
        trackedHash = "";
        targetSeen = false;
      }
    };
    const scheduleSync = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        syncActiveSection();
      });
    };

    const observer = new IntersectionObserver(syncActiveSection, { rootMargin: "-45% 0px -45% 0px" });
    sections.forEach((section) => observer.observe(section));
    window.addEventListener("resize", syncActiveSection);
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("hashchange", syncActiveSection);
    window.addEventListener("popstate", syncActiveSection);
    syncActiveSection();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncActiveSection);
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("hashchange", syncActiveSection);
      window.removeEventListener("popstate", syncActiveSection);
      window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  const copy = useSiteContentValue("global_copy", globalCopy);
  const navigation = navigationRoutes.map((route, index) => {
    const item = copy.navigation[index] ?? globalCopy.navigation[index];
    const childLabels = Array.isArray(item.children)
      ? item.children.filter((label): label is string => typeof label === "string" && Boolean(label.trim()))
      : [];
    const children = childLabels.map((label, childIndex) => ({
      href: route.children[childIndex] ?? childHref(route.href, label),
      label
    })).filter((child) => child.href !== route.href);
    return {
      label: item.label,
      href: route.href,
      children,
      hasDropdown: childLabels.length > 1 && children.length > 0
    };
  });

  const isActive = (href: string) => {
    if (href.includes("#")) {
      const [path = "/", section = ""] = href.split("#");
      return pathname === (path || "/") && activeSection === section;
    }
    if (href === "/") return pathname === "/";
    return pathname === href;
  };

  return (
    <header className="site-header" ref={headerRef}>
      <Link className="brand" href="/" aria-label="Artmonia ana səhifə">
        <img className="brand-logo brand-logo-light" src="/assets/artmonia-logo.webp" alt="Artmonia" />
        <img className="brand-logo brand-logo-dark" src="/assets/artmonia-logo-dark.webp" alt="" aria-hidden="true" />
      </Link>

      <nav className="desktop-nav" aria-label="Əsas naviqasiya">
        {navigation.map((item) =>
          item.hasDropdown ? (
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
          <div className={item.hasDropdown ? "mobile-program-group" : undefined} key={item.label}>
            <Link href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
            {item.hasDropdown ? (
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
