"use client";

import { useEffect, useRef, useState } from "react";

const TONES = ["hero", "journey", "about", "what", "skills", "projects", "research", "experience", "education", "contact"] as const;

type Tone = (typeof TONES)[number];

function isTone(value: string | undefined): value is Tone {
  return TONES.some((tone) => tone === value);
}

// One lightweight scroll loop powers the section colour crossfade, reading
// progress and restrained hero parallax. It mutates CSS variables directly so
// React does not re-render on every scroll frame.
export function SiteAtmosphere() {
  const [activeTone, setActiveTone] = useState<Tone>("hero");
  const activeRef = useRef<Tone>("hero");
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-tone]"));
      const viewportMarker = window.innerHeight * 0.46;
      let nextTone: Tone = "hero";
      let nearestDistance = Number.POSITIVE_INFINITY;

      for (const section of sections) {
        const tone = section.dataset.tone;
        if (!isTone(tone)) continue;
        const rect = section.getBoundingClientRect();
        const containsMarker = rect.top <= viewportMarker && rect.bottom >= viewportMarker;
        const distance = containsMarker ? 0 : Math.min(Math.abs(rect.top - viewportMarker), Math.abs(rect.bottom - viewportMarker));
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nextTone = tone;
        }
      }

      if (activeRef.current !== nextTone) {
        activeRef.current = nextTone;
        setActiveTone(nextTone);
      }

      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;

      root.dataset.scrolled = window.scrollY > 18 ? "true" : "false";
      if (!motionQuery.matches) {
        root.style.setProperty("--hero-shift", `${Math.min(34, window.scrollY * 0.055)}px`);
      }
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
      delete root.dataset.scrolled;
      root.style.removeProperty("--hero-shift");
    };
  }, []);

  return (
    <>
      <div className="site-atmosphere" aria-hidden="true">
        {TONES.map((tone) => (
          <span key={tone} className={tone === activeTone ? "atmosphere-layer active" : "atmosphere-layer"} data-layer={tone} />
        ))}
      </div>
      <span className="journey-progress" aria-hidden="true" ref={progressRef} />
    </>
  );
}
