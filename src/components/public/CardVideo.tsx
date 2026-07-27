"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = { src: string; poster: string | null; label: string };

// Autoplay stays off until the browser confirms motion is welcome, so a
// reduced-motion visitor sees the still frame and never a moving card.
export function CardVideo({ src, poster, label }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [motionOk, setMotionOk] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMotionOk(!query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (motionOk) {
      video.play().catch(() => {
        // A browser refusing autoplay just leaves the poster frame showing.
      });
    } else {
      video.pause();
    }
  }, [motionOk]);

  if (!motionOk && poster) {
    return <Image src={poster} alt={label} fill sizes="(max-width: 980px) 100vw, 380px" />;
  }

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster ?? undefined}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      tabIndex={-1}
    />
  );
}
