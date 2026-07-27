"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type NavLink = { href: string; label: string; sectionId?: string };

export function Nav({ brand, links }: { brand: string; links: NavLink[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const onHome = pathname === "/";

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

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
          {brand}
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
          {"☰"}
        </button>

        <button className="theme" type="button" aria-label="Switch theme" onClick={toggleTheme}>
          {theme === "light" ? "☀" : "🌙"}
        </button>
      </div>
    </header>
  );
}
