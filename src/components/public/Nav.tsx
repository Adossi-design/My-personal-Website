"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type NavLink = { href: string; label: string; sectionId?: string };

export function Nav({ brand, links }: { brand: string; links: NavLink[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const onHome = pathname === "/";

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  // Scroll spy only makes sense on the page that actually holds the sections.
  useEffect(() => {
    if (!onHome) {
      setActive(null);
      return;
    }
    const ids = links.map((l) => l.sectionId).filter((id): id is string => Boolean(id));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [onHome, links]);

  function toggleTheme() {
    const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // A blocked localStorage just means the choice is not remembered.
    }
    setTheme(next);
  }

  return (
    <header className="nav">
      <div className="shell">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">AF</span>
          <span className="brand-name">{brand}</span>
        </Link>

        <nav className={open ? "links open" : "links"} id="navLinks">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={onHome && link.sectionId && active === link.sectionId ? "active" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="nav-toggle"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="navLinks"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          )}
        </button>

        <button
          className="theme"
          type="button"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.64 5.64l1.42 1.42M16.94 16.94l1.42 1.42M18.36 5.64l-1.42 1.42M7.06 16.94l-1.42 1.42" /><circle cx="12" cy="12" r="4" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.4A8 8 0 018.6 4a8 8 0 1011.4 11.4z" /></svg>
          )}
        </button>
      </div>
    </header>
  );
}
