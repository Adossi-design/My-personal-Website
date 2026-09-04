"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";

export function InteractiveCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef<number>(0);

  useEffect(() => () => window.cancelAnimationFrame(frame.current), []);

  function move(event: PointerEvent<HTMLElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (hover: none), (pointer: coarse)").matches) return;
    const card = ref.current;
    if (!card) return;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (event.clientX - left) / width;
    const y = (event.clientY - top) / height;

    window.cancelAnimationFrame(frame.current);
    frame.current = window.requestAnimationFrame(() => {
      card.style.setProperty("--tilt-x", `${(0.5 - y) * 4.5}deg`);
      card.style.setProperty("--tilt-y", `${(x - 0.5) * 5.5}deg`);
      card.style.setProperty("--glow-x", `${x * 100}%`);
      card.style.setProperty("--glow-y", `${y * 100}%`);
      card.classList.add("is-interacting");
    });
  }

  function reset() {
    const card = ref.current;
    if (!card) return;
    window.cancelAnimationFrame(frame.current);
    card.classList.remove("is-interacting");
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <article ref={ref} className={`${className ?? ""} interactive-card`.trim()} onPointerMove={move} onPointerLeave={reset}>
      {children}
    </article>
  );
}
