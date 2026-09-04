import type { ReactNode } from "react";

export function InteractiveCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <article className={`${className ?? ""} interactive-card`.trim()}>
      {children}
    </article>
  );
}
