"use client";

import { useEffect, useRef } from "react";

// A single lightweight scroll loop updates the reading progress and the
// navigation's scrolled state without re-rendering on every frame.
export function SiteAtmosphere() {
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;

      root.dataset.scrolled = window.scrollY > 18 ? "true" : "false";
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
    };
  }, []);

  return <span className="journey-progress" aria-hidden="true" ref={progressRef} />;
}
