"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Scroll-reveal wrapper. Anything already on screen is revealed immediately,
// which is what stops tall sections leaving a blank gap on phones.
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add("in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className ? `${className} reveal` : "reveal"}>
      {children}
    </div>
  );
}
